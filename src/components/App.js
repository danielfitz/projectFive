import React, { Component } from 'react';
import firebase from "../firebase.js";
import Editor from "./Editor.js";
import NotesControls from "./NotesControls.js";
import '../styles/App.scss';
import { Fullscreen, FullscreenExit } from "@material-ui/icons";

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentNoteId: null,
      notes: [],
      fullScreen: false
    }
  }

  componentDidMount() {
    const dbRef = firebase.database().ref();

    dbRef.on("value", (response) => {
      const data = response.val();

      const notesArray = [];

      for (let key in data) {
        notesArray.push({
          id: key,
          title: data[key].title,
          text: data[key].text,
          createdTimestamp: data[key].createdTimestamp
        });
      };

      // Sort notes by newest created note first
      notesArray.sort((a, b) => a.createdTimestamp < b.createdTimestamp);
      
      this.setState({
        notes: notesArray
      });
    });
  };

  selectNote = (noteId) => {
    this.setState({
      currentNoteId: noteId
    });
  };

  toggleFullScreen = () => {
    this.setState({
      fullScreen: !this.state.fullScreen
    });
  };

  render() {
    return (
      <div className="app">
        <header className={this.state.fullScreen ? "collapsed" : ""}>
          <div className="wrapper">
            <h1>Note App</h1>
            <NotesControls
              currentNoteId={this.state.currentNoteId}
              selectNote={this.selectNote}
              notes={this.state.notes}
            />
          </div>
        </header>
        <main className={this.state.fullScreen ? "fullScreen" : ""}>
          <div className="wrapper">
            <Editor
              currentNoteId={this.state.currentNoteId}
              selectNote={this.selectNote}
            />
          </div>
        </main>
        {this.state.fullScreen ?
          <FullscreenExit className="fullScreenToggle" onClick={this.toggleFullScreen} /> :
          <Fullscreen className="fullScreenToggle" onClick={this.toggleFullScreen} />
        }
      </div>
    );
  };
};

export default App;
