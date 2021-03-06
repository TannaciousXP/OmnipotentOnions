import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchChannels, fetchEvents } from '../../actions';
import CreateEvent from './createEvent';
import _ from 'lodash';

import { Segment, Icon, Modal, Button, Menu } from 'semantic-ui-react';

export class GroupEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      activeItem: ''
    };
    this.props.fetchEvents(this.props.groupId);

    this.handleEventClick = this.handleEventClick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleEventClick(eventId) {
    this.props.handleEventDetails(eventId);
  }

  //This creates a function that opens the modal, used when triggered in render

  handleOpen() { 
    this.setState({
      modalOpen: true,
    });
  }

  handleItemClick(e, {name}) {
    console.log('name: ', {name});
    this.setState({activeItem: name});
  }

  //creates a function that closes the modal
  //used in createEvents, so that the modal will close on submit 

  handleClose() { 
    this.setState({
      modalOpen: false,
    });
  }
  
  //Maps the list of events from the user on the sidebar

  renderEvents() {
    return _.map(this.props.events, event => {
      return (
        <Menu.Item 
          key={event.id}
          active={this.state.activeItem === event.eventName}
          name={event.eventName}
          value={event.id}
          onClick={ (e, d) => {
            this.handleItemClick(e, d),
            this.handleEventClick(event.id);
          }}>
          {event.eventName}
        </Menu.Item>
      );
    });
  }

  render() {
    return (
      <Menu.Item>
        <Menu.Header>
          Group Events
          <Modal
            trigger={
              <Icon className='events' 
                name='plus circle' 
                inverted color='teal' 
                size='small' 
                onClick={this.handleOpen}/>
            }
            size='large'
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon='close'
          >
            <CreateEvent 
              groupId={this.props.groupId} 
              handleClose={this.handleClose}
            />
          </Modal>
        </Menu.Header>

        <Menu.Menu>
          {this.renderEvents()}
        </Menu.Menu>
      </Menu.Item>
    );
  }
}

const mapStateToProps = function(state) {
  return { events: state.events };
};

export default connect(mapStateToProps, { fetchEvents })(GroupEvents);
