import HeadingIntroBanner from '@/components/HeadingIntroBanner';

export default function AboutPage() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* About Us Header */}
      <HeadingIntroBanner
        title="About Us"
        backgroundImage="/images/Headers/AboutUs.jpg"
        backgroundPosition="bottom"
      />

      {/* Mission Section */}
      <div style={{backgroundColor: '#9E1B32', width: '100%', margin: 0}}>
        {/* Title Container */}
        <div style={{padding: '2em 0', paddingBottom: 0, backgroundColor: '#9E1B32'}}>
          <h1 style={{
            fontFamily: 'Roboto, sans-serif',
            color: 'white',
            textAlign: 'center',
            fontSize: '2em',
            fontWeight: 'bold'
          }}>
            <strong>MISSION</strong>
          </h1>
          <hr style={{
            width: '30%',
            margin: '0 auto',
            borderColor: 'white',
            borderWidth: '1px 0 0 0'
          }} />
        </div>
        
        {/* Content Container */}
        <div style={{
          backgroundColor: '#9E1B32',
          paddingBottom: '3em'
        }}>
          <p style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '1.5em',
            marginBottom: 0,
            fontFamily: 'Roboto, sans-serif',
            lineHeight: 'normal'
          }}>
            APC will enhance economic development in Alabama using UA resources to increase productivity in organizations <br /> by solving real-world problems while providing positive experiences for students.
          </p>
        </div>
      </div>

      {/* History Section */}
      <div className="history-section" style={{
        backgroundColor: '#EEEEEE',
        width: '100%',
        padding: '1em'
      }}>
        {/* Title Container */}
        <div style={{padding: '2em 0', backgroundColor: '#EEEEEE'}}>
          <h1 style={{
            fontFamily: 'Roboto, sans-serif',
            color: 'black',
            textAlign: 'center',
            fontSize: '2em',
            fontWeight: 'bold'
          }}>
            <strong>HISTORY</strong>
          </h1>
          <hr style={{
            width: '30%',
            height: '1px',
            backgroundColor: 'black',
            border: '0',
            margin: '1em auto 0'
          }} />
        </div>
        
        {/* Content Container */}
        <div style={{
          backgroundColor: '#EEEEEE',
          paddingBottom: '3em'
        }}>
          <p className="history-text" style={{
            textAlign: 'center',
            color: 'black',
            fontSize: '1.5em',
            marginBottom: 0,
            fontFamily: 'Roboto, sans-serif',
            lineHeight: 'normal',
            paddingLeft: '24px',
            paddingRight: '24px'
          }}>
            In an effort to improve economic development in the state of Alabama, the Alabama Productivity Center was established on January 1, 1986, on the University of Alabama campus. The mission of the APC is to focus research and educational resources on the enhancement of productivity and quality within Alabama businesses and the state's industry. The Alabama Productivity Center, a non-profit organization, is an outcome of a 1983 joint venture of the University of Alabama and General Motors to save a Tuscaloosa GM plant from closing. The positive experience utilizing university faculty and students to save Alabama jobs led to the establishment and sponsorship by Alabama Power Company and the University of Alabama.
            <br /><br />
            In 1996, APC became home to Region 3 of the Alabama Technology Network (ATN), the Manufacturing Extension Partnership program of the National Institute of Standards and Technology (NIST) for the state of Alabama. Headquartered in Montgomery, the ATN brings together a set of sixteen regional centers covering the entire state and serving the technical assistance and workforce development needs of small- and medium-sized manufacturing firms. The APC's accomplishments, such as recognition by the National Council for Urban Development and the U.S. Economic Development Administration as an "innovative" and "imaginative" program, demonstrate that the APC is a valuable resource for Alabama businesses.
          </p>
        </div>
      </div>

      {/* Meet the Staff Section */}
      <div id="StaffSectionLoc" className="staff-section" style={{
        backgroundColor: 'white',
        width: '100%',
        padding: '4em 1em 3em 1em'
      }}>
        {/* Title Container */}
        <div style={{padding: '2em 0 1em 0'}}>
          <h1 style={{
            fontFamily: 'Roboto, sans-serif',
            color: 'black',
            textAlign: 'center',
            fontSize: '2em',
            fontWeight: 'bold'
          }}>
            <strong>MEET THE STAFF</strong>
          </h1>
          <hr style={{
            width: '30%',
            height: '1px',
            backgroundColor: 'black',
            border: '0',
            margin: '1em auto 0'
          }} />
        </div>
        
        {/* Staff Grid */}
        <div style={{
          margin: '0 auto',
          padding: '2em 1em',
          position: 'relative'
        }}>
          {/* First Row - 3 staff members offset to center between bottom row */}
          <div className="staff-row" style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '3em',
            paddingLeft: '16.66%',
            paddingRight: '16.66%'
          }}>
            {/* Alan Hill */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <a href="/Profiles/AlanHill" className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/StaffProfilePics/A. Hill Picture.jpg" 
                    alt="Alan Hill"
                    style={{width: '115%', marginLeft: '-15px'}}
                  />
                </a>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Alan Hill
              </h3>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Executive Director
              </h4>
            </div>

            {/* Morgan Harrison */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <a href="/Profiles/MorganHarrison" className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/StaffProfilePics/Harrisons18 square .jpg" 
                    alt="Morgan Harrison"
                  />
                </a>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Morgan Harrison
              </h3>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Productivity Engineer
              </h4>
            </div>

            {/* Jan Ingenrieth */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <a href="/Profiles/JanIngenrieth" className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/StaffProfilePics/JanUpdated.JPG" 
                    alt="Jan Ingenrieth"
                  />
                </a>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Jan Ingenrieth
              </h3>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Director, APC Internship Program
              </h4>
            </div>
          </div>

          {/* Second Row - 4 staff members spanning full width edge-to-edge */}
          <div className="staff-row" style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
            gap: '1em',
            width: '100%'
          }}>
            {/* Justin Rodgers */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <a href="/Profiles/JustinRodgers" className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/StaffProfilePics/Justin_Rodgers_Headshot.jpg" 
                    alt="Justin Rodgers"
                  />
                </a>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Justin Rodgers
              </h3>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Productivity Engineer
              </h4>
            </div>

            {/* Susan Maples */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <a href="/Profiles/SusanMaples" className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/StaffProfilePics/SusanMaples.jpg" 
                    alt="Susan Maples"
                  />
                </a>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Susan Maples
              </h3>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Productivity Engineer
              </h4>
            </div>

            {/* Ben Baxter */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <a href="/Profiles/BenBaxter" className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/StaffProfilePics/Ben Baxter.jpg" 
                    alt="Ben Baxter"
                  />
                </a>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Ben Baxter
              </h3>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Productivity Engineer
              </h4>
            </div>

            {/* Tara Johnson */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <a href="/Profiles/TaraJohnson" className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/StaffProfilePics/TaraJohnson.jpg" 
                    alt="Tara Johnson"
                  />
                </a>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Tara Johnson
              </h3>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Business Manager
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* The Advisory Board Section */}
      <div className="advisory-section" style={{
        backgroundColor: '#3d3d3d',
        backgroundImage: "url('/images/shattered.png')",
        backgroundAttachment: 'fixed',
        width: '100%',
        padding: '3em 0'
      }}>
        <div className="advisory-container" style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          padding: '0 2em'
        }}>
          {/* Left Column - Text Content */}
          <div className="advisory-text-col" style={{
            flex: '0 0 58.33%',
            minWidth: '300px',
            boxSizing: 'border-box',
            paddingLeft: '0',
            paddingRight: '1.5em'
          }}>
            <h1 style={{
              fontFamily: 'Roboto, sans-serif',
              color: 'white',
              textAlign: 'center',
              fontSize: '2.5em',
              fontWeight: 'bold',
              marginBottom: '0.5em'
            }}>
              THE ADVISORY BOARD
            </h1>
            <hr style={{
              width: '60%',
              margin: '0 auto 1.5em auto',
              borderColor: 'white',
              borderWidth: '1px 0 0 0'
            }} />
            <p style={{
              color: 'white',
              fontSize: '1.3em',
              fontFamily: 'Roboto, sans-serif',
              textAlign: 'center',
              lineHeight: '1.4',
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              The Alabama Productivity Center Advisory Board is made of industry, government, and economic development leaders in Alabama that provide guidance to APC to help them better serve clients in the business and industry sector.
            </p>
          </div>

          {/* Right Column - Board Image */}
          <div className="advisory-image-col" style={{
            flex: '0 0 41.67%',
            minWidth: '300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            paddingRight: '0.5em'
          }}>
            <img 
              src="/images/Board2023.jpg" 
              alt="Advisory Board 2023"
              className="advisory-image"
              style={{
                width: '100%',
                maxWidth: '450px',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
                boxShadow: '0 3px 10px rgba(0,0,0,0.7)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Meet the Board Section */}
      <div id="BoardSectionLoc" className="board-section" style={{
        backgroundColor: 'white',
        width: '100%',
        padding: '4em 1em 3em 1em'
      }}>
        {/* Title Container */}
        <div style={{padding: '2em 0 1em 0'}}>
          <h1 style={{
            fontFamily: 'Roboto, sans-serif',
            color: 'black',
            textAlign: 'center',
            fontSize: '2em',
            fontWeight: 'bold'
          }}>
            <strong>MEET THE BOARD</strong>
          </h1>
          <hr style={{
            width: '30%',
            height: '1px',
            backgroundColor: 'black',
            border: '0',
            margin: '1em auto 0'
          }} />
        </div>
        
        {/* Board Grid */}
        <div style={{
          margin: '0 auto',
          padding: '2em 1em',
          position: 'relative'
        }}>
          {/* First Row - 3 board members */}
          <div className="board-row" style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '3em',
            paddingLeft: '16.66%',
            paddingRight: '16.66%'
          }}>
            {/* Kay Palan */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Kay_Palan.jpg" 
                    alt="Kay Palan"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Kay Palan
              </h3>
              <a href="https://culverhouse.ua.edu/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  The University of Alabama
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', maxWidth: '275px', margin: '0 auto', wordWrap: 'break-word'}}>
                Dean, Culverhouse College of Business
              </h4>
            </div>

            {/* Ed Castile */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Ed.png" 
                    alt="Ed Castile"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Ed Castile (Chair)
              </h3>
              <a href="https://www.aidt.edu/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  Alabama Department of Commerce/AIDT
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', maxWidth: '275px', margin: '0 auto', wordWrap: 'break-word'}}>
                Deputy Secretary of Commerce/Director of AIDT
              </h4>
            </div>

            {/* Dr. Samuel Addy */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/SamAddy.png" 
                    alt="Dr. Samuel Addy"
                    style={{width: '140%', height: '140%', marginLeft: '-30px', marginTop: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Dr. Samuel Addy
              </h3>
              <a href="https://culverhouse.ua.edu/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  The University of Alabama
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', maxWidth: '350px', margin: '0 auto', wordWrap: 'break-word', lineHeight: '1.3'}}>
                Associate Dean for Economic Development Outreach, Culverhouse College of Business
              </h4>
            </div>
          </div>

          {/* Second Row - 4 board members */}
          <div className="board-row" style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
            gap: '1em',
            width: '100%',
            marginBottom: '3em'
          }}>
            {/* Frank Anderson */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Frank Anderson.jpg" 
                    alt="Frank Anderson"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Frank Anderson
              </h3>
              <a href="https://www.brasfieldgorrie.com/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  Brasfield and Gorrie
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Regional Director of Business Development
              </h4>
            </div>

            {/* Kenneth Boswell */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/KennethBoswell.png" 
                    alt="Kenneth Boswell"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Kenneth Boswell
              </h3>
              <a href="https://adeca.alabama.gov/Pages/default.aspx" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline', maxWidth: '275px', margin: '0 auto 0.3em auto', wordWrap: 'break-word'}}>
                  Alabama Department of Economic and Community Affairs
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Director
              </h4>
            </div>

            {/* Mark Brazeal */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Mark Brazeal.png" 
                    alt="Mark Brazeal"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Mark Brazeal
              </h3>
              <a href="https://www.findabetterjob.com/mazdatoyota" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  Mazda Toyota Manufacturing USA
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Vice President Manufacturing
              </h4>
            </div>

            {/* Danny Garrett */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/DannyGarrett.png" 
                    alt="Danny Garrett"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Danny Garrett
              </h3>
              <a href="https://www.legislature.state.al.us/aliswww/ISD/Splash_House.aspx" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  Alabama State House of Representatives
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                District 44 Representative
              </h4>
            </div>
          </div>

          {/* Third Row - 4 more board members */}
          <div className="board-row" style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
            gap: '1em',
            width: '100%',
            marginBottom: '3em'
          }}>
            {/* Miller Girvin */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Miller-Girvin.jpg" 
                    alt="Miller Girvin"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Miller Girvin
              </h3>
              <a href="https://edpa.org/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline', maxWidth: '275px', margin: '0 auto 0.3em auto', wordWrap: 'break-word'}}>
                  Economic Development Partnership of Alabama
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                President
              </h4>
            </div>

            {/* Stephanie Howell */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/S Howell.jpg" 
                    alt="Stephanie Howell"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Stephanie Howell
              </h3>
              <a href="https://corporate.evonik.com/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  Evonik
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Regional Human Resources Manager
              </h4>
            </div>

            {/* Dr. Tonjanita Johnson */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Tonjanita.png" 
                    alt="Dr. Tonjanita Johnson"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Dr. Tonjanita Johnson
              </h3>
              <a href="https://uasystem.edu/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  The University of Alabama System
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', maxWidth: '275px', margin: '0 auto', wordWrap: 'break-word'}}>
                Senior Vice Chancellor for Academic and Student Affairs
              </h4>
            </div>

            {/* Joel McMahon */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Joel McMahonHeadshot.png" 
                    alt="Joel McMahon"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Joel McMahon
              </h3>
              <a href="https://jayindustrial.com/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  Jay Industrial Repair
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                CEO
              </h4>
            </div>
          </div>

          {/* Fourth Row */}
          <div className="board-row" style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
            gap: '1em',
            width: '100%',
            marginBottom: '3em'
          }}>
            {/* Ellen McNair */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Ellen-McNair.jpg" 
                    alt="Ellen McNair"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Ellen McNair
              </h3>
              <a href="https://www.madeinalabama.com/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  Alabama Department of Commerce
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Secretary of Commerce
              </h4>
            </div>

            {/* Robin Murphree */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Robin_Murphree.jpg" 
                    alt="Robin Murphree"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Robin Murphree
              </h3>
              <a href="https://churchsteeples.com/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  Fiberglass Unlimited
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Partner
              </h4>
            </div>

            {/* Keith Phillips */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Keith_Phillips.png" 
                    alt="Keith Phillips"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Keith Phillips
              </h3>
              <a href="https://www.atn.org/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  Alabama Technology Network
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Executive Director
              </h4>
            </div>

            {/* Jon Pollard */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Jon_Pollard.jpg" 
                    alt="Jon Pollard"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Jon Pollard
              </h3>
              <a href="https://www.tylerunion.com/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  Tyler Union & M&H Valve
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Vice President, Anniston Operations
              </h4>
            </div>
          </div>

          {/* Fifth Row */}
          <div className="board-row" style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
            gap: '1em',
            width: '100%',
            marginBottom: '3em'
          }}>
            {/* Greg Scott */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Greg_Scott.jpg" 
                    alt="Greg Scott"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Greg Scott
              </h3>
              <a href="https://www.ssab.com/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  SSAB Americas
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', maxWidth: '275px', margin: '0 auto', wordWrap: 'break-word'}}>
                Vice President, Human Resources and Communication
              </h4>
            </div>

            {/* Maria Short */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Maria_Short.jpg" 
                    alt="Maria Short"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Maria Short
              </h3>
              <a href="https://westervelt.com/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  The Westervelt Company
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Executive Vice President, Human Resources
              </h4>
            </div>

            {/* Danielle Crowder */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Danielle_Crowder.png" 
                    alt="Danielle Crowder"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Danielle Crowder
              </h3>
              <a href="https://www.alabamapower.com/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  Alabama Power Company
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Sales Director
              </h4>
            </div>

            {/* Anthony Cancilla */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Anthony_Cancilla.jpg" 
                    alt="Anthony Cancilla"
                    style={{width: '113%', height: '113%', marginLeft: '-15px'}}
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Anthony Cancilla
              </h3>
              <a href="https://www.mbusi.com/" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  Mercedes Benz
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Manager, HR
              </h4>
            </div>
          </div>

          {/* Sixth Row - Ethan Mattocks centered */}
          <div className="board-row" style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '3em'
          }}>
            {/* Ethan Mattocks */}
            <div className="staff-member" style={{flex: '0 0 auto'}}>
              <div className="headshot-container">
                <div className="image-cropper">
                  <img 
                    className="staff-photo" 
                    src="/images/Board Headshots/Ethan_Mattocks.jpg" 
                    alt="Ethan Mattocks"
                  />
                </div>
              </div>
              <h3 style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', marginBottom: '0.3em', fontFamily: 'Roboto, sans-serif', color: '#9E1B32', fontWeight: 'normal'}}>
                Ethan Mattocks
              </h3>
              <a href="https://www.airbus.com/en" target="_blank" rel="noopener noreferrer">
                <h4 style={{textAlign: 'center', fontSize: '1.05em', marginTop: '0', marginBottom: '0.3em', color: 'blue', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal', textDecoration: 'underline'}}>
                  Airbus Americas, Inc.
                </h4>
              </a>
              <h4 style={{textAlign: 'center', fontSize: '1.1em', marginTop: '0', color: 'black', fontFamily: 'Roboto, sans-serif', fontWeight: 'normal'}}>
                Director of Technical Learning and Early Careers
              </h4>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
