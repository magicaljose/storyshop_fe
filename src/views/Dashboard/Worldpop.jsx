import React from 'react';
import Popup from "reactjs-popup";
import AddIcon from '@material-ui/icons/Add';

class Worldpop extends React.Component {
  state = {
    isHovering:false
  }

  handleMouseEnter = (event) => {
      this.setState({ isHovering: true });
    }

    handleMouseLeave = (event) => {
      this.setState({ isHovering: false });
    }

  render() {
    const { open, openModal, closeModal, name, handleSubmit, handleChange } = this.props;

    return (
      <div className=''>
        <div className='add-wrld-grp'>
           <button 
           color="primary" className="button Season" onClick={openModal}><AddIcon /></button>
           <span className="fixed-hov-ob">Add World</span>
        </div>
       
        <Popup
          open={open}
          onClose={closeModal}
          closeOnDocumentClick >
          <form className="wo_rld" onSubmit={handleSubmit} >
		        <div>
              <div>  <label className='cmn-hd-cl'>World Name</label>
		            <input autoFocus type="text" name="name" label="World Name" className="textField mf" value={name} onChange={handleChange} margin="normal"/>
		          </div>

              <div>
		            <button type='submit' className="world-add" >Create World</button>
              </div>
            </div>
		      </form>
        </Popup>
      </div>
    )
  }
}

export default Worldpop;
