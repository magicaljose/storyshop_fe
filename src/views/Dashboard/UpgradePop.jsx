import React from 'react';
import Popup from 'reactjs-popup';
import { Button } from '@material-ui/core';
import config from 'views/config.js';

import layer0_adv from 'assets/img/layer0_adv.png';
import layer1_adv from 'assets/img/layer1_adv.png';
import layer2_adv from 'assets/img/layer2_adv.png';
import layer3_adv from 'assets/img/layer3_adv.png';
import worldBuilders from '../worldBuilders.js';

const liteWorldBuilders = [
  "Character", "Setting", "Notes & Reference"
];

class UpgradePop extends React.Component {
  state = {
    open: false,
  }

  openModal = () => {
    this.setState({
      open: true
    });
  }

  closeModal = () => {
    if (this.props.openManual) {
        this.props.closeModal();
        return;
    }

    this.setState({
      open: false
    });
  }

  sendToUpreade = () => {
    window.location.assign(config.HOST_URL + '/product/storyshop/');
  }

  render() {
    let open = this.state.open;

    if (this.props.openManual) {
        open = this.props.open;
    }

    return (
      <div key={Math.random()} className='upgrade-pop'>
        {
            !this.props.openManual && (
                <div className='btns-grp'>
                    <span className="pr-txt">(Pro Feature)</span>
                    <div className='icn-btn' onClick={this.openModal}>
                      <i className="fa fa-info-circle pro-inf"></i>
                    </div>
                </div>
            )
        }

        <Popup className='show-pop-upgrade'
          open={open} onClose={() => this.closeModal()}
          modal closeOnDocumentClick>
            <div className='cmn-up-sec rw-1'>
              <div className='rw-1-txt'>
                Upgrading to Pro
              </div>
            </div>

            <div className='cmn-up-sec rw-2'>
              <div className='rw-2-txt'>
                33 New World Card Categories:
              </div>

              <div className='rw-2-lst'>
                <ul>
                  {
                    worldBuilders.map((builder, index) => {
                      if (!liteWorldBuilders.includes(builder)) {
                        return (
                          <li key={index}>{builder}</li>
                        )
                      }
                    })
                  }
                </ul>
              </div>
            </div>

            <div className='cmn-up-sec rw-3'>
              <div className='rw-3-txt'>
                Deeper World-Building with Advanced Fields
              </div>

              <div className='rw-3-lst'>
                <div className='cmn-rw3-lst'>
                  <img alt="Image Portfolios" src={layer0_adv}/>
                  <span>Image Portfolios</span>
                </div>

                <div className='cmn-rw3-lst'>
                  <img alt="Relationships" src={layer1_adv}/>
                  <span>Relationships</span>
                </div>

                <div className='cmn-rw3-lst'>
                  <img alt="World DNA" src={layer2_adv}/>
                  <span>World DNA</span>
                </div>

                <div className='cmn-rw3-lst'>
                  <img alt="Appearances" src={layer3_adv}/>
                  <span>Appearances</span>
                </div>
              </div>
            </div>

            <div className='cmn-up-sec rw-4'>
              <div className='rw-4-btxt'>
                <span className='bg-txt'>12</span> Beats Story Templates
              </div>
              <div className='rw-4-btn'>
                <button className='up-btn' onClick={this.sendToUpreade}>
                  Upgrade!
                </button>
              </div>
              <div className='rw-4-addtxt'>
                <span className='bg-txt'>+</span> Invite buddies to Collaborate
              </div>
            </div>
          </Popup>
      </div>
    )
  }
}

export default UpgradePop;
