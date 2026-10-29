'use client';

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  GET_USERS_API,
  RESET_USER_PASSWORD_API,
  DELETE_USER_API,
  type UsersByRoleResponse,
  type UserListItem,
} from "@/lib/api";
import TempCredentialsNotice, {
  TempCredentialsFooter,
} from "@/components/TempCredentialsNotice";

const ROLE_LABELS: Record<string, string> = {
  accountant: "Accountant",
  admin: "Admin",
  advisor: "Advisor",
  client: "Client",
  IT: "IT",
  staff: "Staff",
  intern: "Intern",
  reception: "Reception",
};

const ROLES_ORDER = [
  "accountant",
  "admin",
  "advisor",
  "client",
  "IT",
  "staff",
  "intern",
  "reception",
] as const;

type RoleKey = (typeof ROLES_ORDER)[number];

function GhostBlock({ width }: { width: string }) {
  return (
    <div
      aria-hidden
      style={{
        height: "16px",
        width,
        backgroundColor: "rgb(209 213 219)",
        borderRadius: "4px",
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }}
    />
  );
}

const modalButtonClass =
  "inline-flex items-center px-[12px] py-[6px] border border-[#900] rounded-[10px] text-[#900] bg-gray-200 hover:bg-gray-300 hover:border-[#700] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline";

function UserTable({
  users,
  loading,
  onResetPassword,
  onDeleteUser,
}: {
  users: UserListItem[];
  loading: boolean;
  onResetPassword?: (userId: string, userName: string) => void;
  onDeleteUser?: (userId: string) => void;
}) {
  const thClass =
    "border border-[#7a0000] p-[10px] text-white font-normal text-center";

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-roboto text-sm">
          <caption className="sr-only">Users</caption>
          <thead>
            <tr className="bg-[#9E1B32]">
              <th scope="col" className={thClass}>
                UserName
              </th>
              <th scope="col" className={thClass}>
                Name
              </th>
              <th scope="col" className={thClass}>
                Email
              </th>
              <th scope="col" className={thClass}>
                Company
              </th>
              <th scope="col" className={thClass}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 1 }).map((_, idx) => (
              <tr key={idx} className="bg-white">
                <td className="border border-[#ddd] p-[10px] text-center align-middle">
                  <div className="flex justify-center">
                    <GhostBlock width="110px" />
                  </div>
                </td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle">
                  <div className="flex justify-center">
                    <GhostBlock width="160px" />
                  </div>
                </td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle">
                  <div className="flex justify-center">
                    <GhostBlock width="180px" />
                  </div>
                </td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle">
                  <div className="flex justify-center">
                    <GhostBlock width="140px" />
                  </div>
                </td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle">
                  <div className="flex justify-center">
                    <GhostBlock width="170px" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-roboto text-sm">
          <caption className="sr-only">Users</caption>
          <thead>
            <tr className="bg-[#9E1B32]">
              <th scope="col" className={thClass}>
                UserName
              </th>
              <th scope="col" className={thClass}>
                Name
              </th>
              <th scope="col" className={thClass}>
                Email
              </th>
              <th scope="col" className={thClass}>
                Company
              </th>
              <th scope="col" className={thClass}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white hover:bg-[#f5f5f5]">
              <td
                colSpan={5}
                className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]"
              >
                No users in this role.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-roboto text-sm">
        <caption className="sr-only">Users</caption>
        <thead>
          <tr className="bg-[#9E1B32]">
            <th scope="col" className={thClass}>
              UserName
            </th>
            <th scope="col" className={thClass}>
              Name
            </th>
            <th scope="col" className={thClass}>
              Email
            </th>
            <th scope="col" className={thClass}>
              Company
            </th>
            <th scope="col" className={thClass}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="bg-white hover:bg-[#f5f5f5]">
              <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                {u.userName}
              </td>
              <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                {[u.lastName, u.firstName].filter(Boolean).join(", ") || "—"}
              </td>
              <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                {u.email || "—"}
              </td>
              <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                {u.companyName || "—"}
              </td>
              <td className="border border-[#ddd] p-[10px] text-center align-middle">
                <button
                  type="button"
                  onClick={() => onResetPassword?.(u.id, u.userName)}
                  className="bg-transparent border-0 p-0 cursor-pointer font-inherit text-[#666] no-underline hover:underline text-sm"
                >
                  Reset Password
                </button>
                {u.canDelete && (
                  <>
                    <span className="text-[#666] mx-1"> | </span>
                    <button
                      type="button"
                      onClick={() => onDeleteUser?.(u.id)}
                      className="bg-transparent border-0 p-0 cursor-pointer font-inherit text-[#666] no-underline hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
                <span className="text-[#666] mx-1"> | </span>
                <Link
                  href={`/Manage/AssignRoles/${u.id}`}
                  className="bg-transparent border-0 p-0 cursor-pointer font-inherit text-[#666] no-underline hover:underline text-sm"
                >
                  Roles
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function UsersPage() {
  const [data, setData] = useState<UsersByRoleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetConfirmUser, setResetConfirmUser] = useState<{
    id: string;
    userName: string;
  } | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetCredentials, setResetCredentials] = useState<{
    userName: string;
    temporaryPassword: string;
  } | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const res = await GET_USERS_API();
    setLoading(false);
    if (res.ok) {
      setData(res.data);
      setError(null);
    } else {
      setError(res.error);
      setData(null);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function handleResetPassword(userId: string, userName: string) {
    setResetConfirmUser({ id: userId, userName });
  }

  async function confirmResetPassword() {
    if (!resetConfirmUser || resetLoading) return;
    setResetLoading(true);
    const res = await RESET_USER_PASSWORD_API(resetConfirmUser.id);
    setResetLoading(false);
    setResetConfirmUser(null);
    if (res.ok) {
      setResetCredentials({
        userName: res.userName,
        temporaryPassword: res.temporaryPassword,
      });
    } else {
      alert(res.error);
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!window.confirm("Are you sure you wish to delete this user?")) return;
    const res = await DELETE_USER_API(userId);
    if (res.ok) {
      loadUsers();
    } else {
      alert(res.error);
    }
  }

  const usersByRole = data?.byRole;
  const usersWithoutRole = data?.usersWithoutRole ?? [];

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2
            className="text-[30px] font-roboto"
            style={{ fontWeight: "normal", color: "#000000" }}
          >
            Users
          </h2>
        </div>

        <div className="mb-4">
          <Link
            href="/Manage/Users/CreateNewUser"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline"
          >
            Create New
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm font-roboto" role="alert">
            {error}
          </div>
        )}

        <div className="manage-accordion px-4 mt-8" style={{ marginTop: "48px" }}>
          <Accordion
            disableIndicatorAnimation={false}
            showDivider={false}
            selectionMode="multiple"
            itemClasses={{
              base: "px-0 shadow-none border border-gray-300 rounded-lg mb-3",
              heading: "m-0 p-0",
              trigger:
                "bg-gray-100 hover:bg-gray-200 data-[hover=true]:bg-gray-200 rounded-lg",
              title: "text-[16px] font-normal text-[#666666] text-left",
              titleWrapper: "flex-1",
              content: "bg-white rounded-lg",
              indicator: "text-black",
            }}
          >
            <AccordionItem
              key="accountant"
              aria-label="Accountant"
              title="Accountant"
              HeadingComponent="div"
            >
              <UserTable
                loading={loading}
                users={usersByRole?.accountant ?? []}
                onResetPassword={handleResetPassword}
                onDeleteUser={handleDeleteUser}
              />
            </AccordionItem>

            <AccordionItem key="admin" aria-label="Admin" title="Admin" HeadingComponent="div">
              <UserTable
              loading={loading}
              users={usersByRole?.admin ?? []}
              onResetPassword={handleResetPassword}
              onDeleteUser={handleDeleteUser}
            />
            </AccordionItem>

            <AccordionItem
              key="advisor"
              aria-label="Advisor"
              title="Advisor"
              HeadingComponent="div"
            >
              <UserTable
              loading={loading}
              users={usersByRole?.advisor ?? []}
              onResetPassword={handleResetPassword}
              onDeleteUser={handleDeleteUser}
            />
            </AccordionItem>

            <AccordionItem
              key="client"
              aria-label="Client"
              title="Client"
              HeadingComponent="div"
            >
              <UserTable
              loading={loading}
              users={usersByRole?.client ?? []}
              onResetPassword={handleResetPassword}
              onDeleteUser={handleDeleteUser}
            />
            </AccordionItem>

            <AccordionItem key="IT" aria-label="IT" title="IT" HeadingComponent="div">
              <UserTable
              loading={loading}
              users={usersByRole?.IT ?? []}
              onResetPassword={handleResetPassword}
              onDeleteUser={handleDeleteUser}
            />
            </AccordionItem>

            <AccordionItem
              key="staff"
              aria-label="Staff"
              title="Staff"
              HeadingComponent="div"
            >
              <UserTable
              loading={loading}
              users={usersByRole?.staff ?? []}
              onResetPassword={handleResetPassword}
              onDeleteUser={handleDeleteUser}
            />
            </AccordionItem>

            <AccordionItem
              key="intern"
              aria-label="Intern"
              title="Intern"
              HeadingComponent="div"
            >
              <UserTable
              loading={loading}
              users={usersByRole?.intern ?? []}
              onResetPassword={handleResetPassword}
              onDeleteUser={handleDeleteUser}
            />
            </AccordionItem>

            <AccordionItem
              key="reception"
              aria-label="Reception"
              title="Reception"
              HeadingComponent="div"
            >
              <UserTable
              loading={loading}
              users={usersByRole?.reception ?? []}
              onResetPassword={handleResetPassword}
              onDeleteUser={handleDeleteUser}
            />
            </AccordionItem>
          </Accordion>
        </div>

        {!loading && !error && usersWithoutRole.length > 0 && (
          <div className="mt-8 px-4">
            <h3 className="text-[18px] font-roboto text-[#333] mb-3">
              No Role
            </h3>
            <UserTable
            loading={false}
            users={usersWithoutRole}
            onResetPassword={handleResetPassword}
            onDeleteUser={handleDeleteUser}
          />
          </div>
        )}
      </div>

      <Modal
        isOpen={!!resetConfirmUser}
        onOpenChange={(open) => {
          if (!open && !resetLoading) setResetConfirmUser(null);
        }}
        hideCloseButton
        isDismissable={!resetLoading}
      >
        <ModalContent className="max-w-[420px] w-full">
          <ModalHeader className="flex flex-col items-center gap-0 pb-2 border-b-0">
            <h3 className="font-roboto font-bold text-[#000000] text-center w-full">
              Reset password?
            </h3>
            <p className="font-roboto font-normal text-[#000000] text-center mt-1" style={{ fontSize: "11px" }}>
              *A temporary password will be shown once. This cannot be undone.
            </p>
          </ModalHeader>
          <ModalBody className="gap-4 flex flex-col items-center" style={{ paddingBottom: 24 }}>
            <p className="font-roboto text-[14px] text-[#333] text-center m-0">
              Reset password for{" "}
              <span className="font-bold">{resetConfirmUser?.userName}</span>?
            </p>
          </ModalBody>
          <ModalFooter style={{ gap: 12, paddingTop: 20, paddingBottom: 20, justifyContent: "center" }}>
            <button
              type="button"
              disabled={resetLoading}
              onClick={() => setResetConfirmUser(null)}
              className={modalButtonClass + " disabled:opacity-70 disabled:cursor-not-allowed"}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={resetLoading}
              onClick={confirmResetPassword}
              className={modalButtonClass + " disabled:opacity-70 disabled:cursor-not-allowed"}
            >
              {resetLoading ? "Resetting…" : "Reset password"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={!!resetCredentials}
        onOpenChange={(open) => {
          if (!open) setResetCredentials(null);
        }}
        hideCloseButton
        isDismissable={false}
      >
        <ModalContent className="max-w-[420px] w-full">
          <ModalHeader className="flex flex-col items-center gap-0 pb-2 border-b-0">
            <h3 className="font-roboto font-bold text-[#000000] text-center w-full">
              Password reset
            </h3>
            <p className="font-roboto font-normal text-[#000000] text-center mt-1" style={{ fontSize: "11px" }}>
              *Share these with the user. The temporary password will not be shown again.
            </p>
          </ModalHeader>
          <ModalBody className="gap-4 flex flex-col items-center" style={{ paddingBottom: 24 }}>
            {resetCredentials && (
              <TempCredentialsNotice
                userName={resetCredentials.userName}
                temporaryPassword={resetCredentials.temporaryPassword}
                showActions={false}
                onDone={() => setResetCredentials(null)}
              />
            )}
          </ModalBody>
          {resetCredentials && (
            <ModalFooter style={{ gap: 12, paddingTop: 20, paddingBottom: 20, justifyContent: "center" }}>
              <TempCredentialsFooter
                userName={resetCredentials.userName}
                temporaryPassword={resetCredentials.temporaryPassword}
                doneLabel="Done"
                onDone={() => setResetCredentials(null)}
              />
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
