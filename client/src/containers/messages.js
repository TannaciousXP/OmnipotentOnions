import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMessages, createMessage, fetchGroups, fetchChannels, fetchOneGroup } from '../actions';

import io from 'socket.io-client';

import VideoChat from './video_chat';
import MessageBoard from '../components/messages_board';
import MessageInput from './messages_input';
import { Segment, Header, Button } from 'semantic-ui-react';

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVideoChat: false,
    };

    this.onHandleVideoChatJoin = this.onHandleVideoChatJoin.bind(this);
    this.onHandleVideoChatLeave = this.onHandleVideoChatLeave.bind(this);
  }
  
  componentDidMount() {
    this.props.socket.on('display-message', message => {
      if (message.channel_id === this.props.channelId) {
        this.props.createMessage(message);
      }
    });
    this.props.fetchGroups(this.props.profile)
      .then((groups) => {
        this.props.fetchChannels(groups.payload.data[0].group_id)
          .then((channels) => {
            this.setState({
              channelId: channels.payload.data[0].id
            });
          });
      }); 
  }
  
  onHandleVideoChatJoin() {
    if (this.props.channelId !== undefined) {
      this.setState({
        showVideoChat: true
      });
      
      document.getElementById('joinVideoChat').style.display = 'none';
    } else {
      alert('Join a channel');
    }
    
  }

  onHandleVideoChatLeave() {
    this.setState({
      showVideoChat: false
    });

    document.getElementById('joinVideoChat').style.display = 'initial';    
  }

  render() {
    return (
      <div>
        <div id='chat-bg-color'></div>
        <div id='video-chat-fronter'>
          <Segment inverted>
            <Header inverted color='teal' size='large'> {this.props.channel[this.props.channelId] ? this.props.channel[this.props.channelId].name : 'Select a Channel!' } </Header> 
            <Button className='ui teal' onClick={this.onHandleVideoChatJoin} id='joinVideoChat'>Join Video Chat</Button>
            {
              this.state.showVideoChat ? <VideoChat toggleVideo={this.onHandleVideoChatLeave} channelId={this.props.channelId}/> : null
            }
          </Segment>
        </div>
        <div id='message-scroll'>
          <MessageBoard 
            socket={this.props.socket}
            messages={this.props.messages}
            channelId={this.props.channelId}
            profileId={this.props.profile.id}
          />
        </div>
        <div id='message-input'>
          <MessageInput
            socket={this.props.socket}
            channelId={this.props.channelId}
            profile={this.props.profile}
            
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return { messages: state.messages, channel: state.channels, profile: state.profile };
};

export default connect(mapStateToProps, { fetchMessages, createMessage, fetchGroups, fetchChannels, fetchOneGroup })(Messages);