import { useState } from 'react';
import { Pencil, X, PlusCircle } from 'lucide-react';

//TODO: add controlled inputs, make form real , make rows editable with enter submitting 
//make add offer/ask button work

const mockUser = {
  id: "user_123456789",
  displayName: "John Doe",
  email: "john.doe@example.com",
  createdAt: new Date("2023-01-01T00:00:00Z"),
  updatedAt: new Date("2023-03-15T12:30:00Z"),
  socials: [
    { id: "social_1", name: "Twitter", value: "@johndoe" },
    { id: "social_2", name: "LinkedIn", value: "linkedin.com/in/johndoe" }
  ],
  asks: [
    { id: "ask_1", description: "Looking for a UX design mentor", createdAt: new Date("2023-02-01T10:00:00Z"), updatedAt: new Date("2023-02-01T10:00:00Z"), isDeleted: false },
    { id: "ask_2", description: "Seeking meditation group", createdAt: new Date("2023-03-01T14:00:00Z"), updatedAt: new Date("2023-03-01T14:00:00Z"), isDeleted: false }
  ],
  offers: [
    { id: "offer_1", description: "Can teach firebreathing techniques", createdAt: new Date("2023-02-15T09:00:00Z"), updatedAt: new Date("2023-02-15T09:00:00Z"), isDeleted: false },
    { id: "offer_2", description: "Available for yoga sessions", createdAt: new Date("2023-03-10T11:00:00Z"), updatedAt: new Date("2023-03-10T11:00:00Z"), isDeleted: false }
  ]
};

function UserInfo() {
  const user = mockUser;
  const [editingUserInfo, setEditingUserInfo] = useState(false);
  //TODO: edit appears only if user's own profile

  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleEdit = () => {
    setEditingUserInfo(!editingUserInfo);
  };

  const handleEdit = () => {
    console.log("Edit clicked");
    toggleEdit();
  };

  const handleSubmit = () => {
    console.log("Submit clicked");
    toggleEdit();
  };

  const handleMouseEnter = (id) => {
    setHoveredItem(id);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const ItemWithHover = ({ item, type }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '10px',
        position: 'relative',
        padding: '5px',
        borderRadius: '4px',
        backgroundColor: hoveredItem === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      }}
      onMouseEnter={() => handleMouseEnter(item.id)}
      onMouseLeave={handleMouseLeave}
    >
      {item.description}
      {hoveredItem === item.id && (
        <span
          style={{
            position: 'absolute',
            right: '5px',
            cursor: 'pointer',
            color: 'white',
          }}
        >
          <Pencil size={16} />
        </span>
      )}
    </div>
  );

  return (
    <div className="grenze-gotisch-title" style={{
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(347deg in oklab, rgb(0% 92% 99% / 70%) -15% -15%, rgb(84% 0% 55% / 71%) 132% 132%)',
      width: '100vw',
      height: '100vh',
      padding: '20px 20px 0 20px',
      boxSizing: 'border-box'
    }}>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '40px'}}>
        {/* Row for user image and info */}
        <img src="https://pbs.twimg.com/profile_images/1784843170108375040/b3NgH0mJ_400x400.jpg" alt="user" style={{width: '200px', height: '200px', borderRadius: '50%', marginRight: '20px', boxShadow: '0 0 10px white'}}/>
          {/* Column for user info */}
          {editingUserInfo ? (
             <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
               <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: 'white', gap: '10px'}}>
                 <input
                   type="text"
                   value={user.displayName}
                   //{*/ onChange={/* TODO: Implement onChange handler */}
                   style={{color: '#3830a6', fontSize: '32px', fontWeight: 'bold', background: 'transparent', border: '1px solid white', borderRadius: '4px'}}
                 />
                 <div>joined on {user.createdAt.toLocaleDateString()}</div>
                 {user.socials.map((social, index) => (
                   <div key={index} style={{
                     display: 'flex', 
                     flexDirection: 'row', 
                     alignItems: 'center', 
                     width: '100%'
                   }}>
                     <input
                       type="text"
                       value={social.name}
                       // onChange={/* TODO: Implement onChange handler */}
                       style={{
                         color: 'white', 
                         fontSize: '16px', 
                         fontWeight: 'bold',
                         marginRight: '30px',
                         background: 'transparent',
                         border: '1px solid white',
                         borderRadius: '4px',
                         width: '100px'
                       }}
                     />
                     <input
                       type="text"
                       value={social.value}
                       // onChange={/* TODO: Implement onChange handler */}
                       style={{
                         color: 'white', 
                         fontSize: '16px',
                         background: 'transparent',
                         border: '1px solid white', 
                         borderRadius: '4px',
                         flexGrow: 1
                       }}
                     />
                   </div>
                 ))}
                 <button type="submit" style={{color: 'white', background: 'transparent', border: '1px solid white', borderRadius: 8, padding: '8px',}}> Save </button>
               </form>
               {/* TODO: uhg i cant figure out how to align the buttons the way i want */}
               <button style={{background: 'transparent', border: 'none', padding: 0, margin: 0, alignSelf: 'flex-start'}}>
                 <X onClick={() => toggleEdit()} size={32} color="white" style={{display: 'flex', justifySelf: 'flex-end', paddingTop: '45px', paddingRight: '20px'}} />
               </button>
             </div>
          ) : (
            <div style={{display: 'flex'}}> 
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: 'white', gap: '10px'}}>
              <div style={{color: '#3830a6', fontSize: '32px', fontWeight: 'bold'}}>{user.displayName}</div>
              <div> joined on {user.createdAt.toLocaleDateString()}</div>
              {user.socials.map((social, index) => (
                <div key={index} style={{
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  width: '100%'
                }}>
                  <div style={{
                    color: 'white', 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    marginRight: '30px',
                    width: '100px'
                  }}>{social.name}</div>
                  <div style={{
                    color: 'white', 
                    fontSize: '16px',
                    flexGrow: 1
                  }}>{social.value}</div>
                </div>
              ))}
            </div>
            <Pencil onClick={handleEdit} size={32} color="white" style={{alignSelf: 'flex-start', paddingTop: '45px', paddingRight: '20px'}} />
          </div>
          )}
      </div>
      {/* Column for offers and asks */}
      <div style={{display: 'flex', flexDirection: 'column', color: 'white', gap: '20px', border: '1px solid white', padding: '20px'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <div style={{fontSize: '20px', fontWeight: 'bold'}}>
            I am <span style={{background: 'linear-gradient(to right, #0000FF, #FF69B4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>offering...</span>
            <PlusCircle style={{marginLeft: "10px"}}/> 
          </div>
          {user.offers.map((offer) => (
            <ItemWithHover key={offer.id} item={offer} type="offer" />
          ))}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <div style={{fontSize: '20px', fontWeight: 'bold'}}>
            I am <span style={{background: 'linear-gradient(to right, #8B008B, #0000FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>seeking...</span>
            <PlusCircle style={{marginLeft: "18px"}}/>
          </div>
          {user.asks.map((ask) => (
            <ItemWithHover key={ask.id} item={ask} type="ask" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserInfo;