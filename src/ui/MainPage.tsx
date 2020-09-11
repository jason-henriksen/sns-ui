
import React from 'react';
import { observer, inject } from 'mobx-react';

import '../App.css';

import {
  Button, InputLabel, FormControl, Select, MenuItem,
  TextField, Paper, Container, Grid
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'


import { DataStore } from '../data/DataStore';

// material ui configuration
const useStyles = (theme: any) => ({
  root: {
    flexGrow: 1,
    width: '90%'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  formControl: {
    margin: 15,
    width: '90%'

  },
  button: {
    marginRight: 15
  },
  logEntry: {
    fontSize: '14px'
  }
});

// make typescript accept the datastore
interface DataStoreProps {
  DataStore: DataStore,
  classes: any
}


@inject("DataStore") @observer
class MainPage extends React.Component<DataStoreProps> {

  // convince typescript that the injector will do it's job.
  // the new item will end up ignored, but it keeps TS from whining
  static defaultProps = { DataStore: new DataStore() }

  // eslint-disable-next-line
  constructor(props: any) {
    super(props);
    this.props.DataStore.makeConnection()
  }

  render() {
    const classes = this.props.classes as any; // tells typescript to bugger off when accessing it this way.
    let data = this.props.DataStore

    const g = [
      <MenuItem value={'M'}>Male</MenuItem>,
      <MenuItem value={'F'}>Female</MenuItem>,
      <MenuItem value={'O'}>Other</MenuItem>
    ]

    const s = [
      <MenuItem value={'CA'}>California</MenuItem>,
      <MenuItem value={'NV'}>Nevada</MenuItem>,
      <MenuItem value={'OR'}>Oregon</MenuItem>,
      <MenuItem value={'WA'}>Washington</MenuItem>,
    ]

    return (
      <header className="App-header">
        <br /><br /><br /><br />
        <div className={classes.root}>
          <Container maxWidth="lg">
            <Grid container spacing={3}>




              <Grid item xs>
                <Paper className={classes.paper}>
                  <div>I am an <a target='_blank' rel='noopener noreferrer' href='https://www.youtube.com/watch?v=LqJxyuTMMog&feature=youtu.be&t=72'>actor</a>!</div>

                  <FormControl className={classes.formControl}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={data.actorGender}
                      onChange={(e) => { data.actorGender = '' + e.target.value }}
                    >{g}</Select>
                  </FormControl>

                  <FormControl className={classes.formControl}>
                    <InputLabel>State</InputLabel>
                    <Select
                      value={this.props.DataStore.actorState}
                      onChange={(e) => { this.props.DataStore.actorState = '' + e.target.value }}
                    >{s}
                    </Select>
                  </FormControl>

                  <TextField className={classes.formControl}
                    label="Phone Number (must start with 1)"
                    value={this.props.DataStore.actorPhone}
                    onChange={(e) => { data.actorPhone = '' + e.target.value.replace(/[^0-9]/g, "") }}
                  />
                  <Button color="primary" variant="contained" className={classes.button} onClick={() => this.props.DataStore.actorSubscribe()} >Subscribe</Button>
                  <Button color="primary" variant="contained" className={classes.button}>REPLY STOP to END</Button>
                </Paper>
              </Grid>




              <Grid item xs>
                <Paper className={classes.paper}>
                  <div>I am an <a target='_blank' rel='noopener noreferrer' href='https://www.youtube.com/watch?v=EHPdVnUour4'>agent!</a></div>
                  <TextField className={classes.formControl}
                    label="Agency Name"
                    value={data.agentName}
                    onChange={(e) => { data.agentName = '' + e.target.value }}
                  />

                  <FormControl className={classes.formControl}>
                    <InputLabel >State</InputLabel>
                    <Select
                      value={data.agentState}
                      onChange={(e) => { data.agentState = '' + e.target.value }}
                    >{s}</Select>
                  </FormControl>

{ data.agentName && 
<>
                  <div><TextField className={classes.formControl}
                    id="phone"
                    label="Web Hook URL"
                    value={`{server}/Prod/webhook/${data.agentState}/${data.agentName}`}
                  /></div>

                  <Button color="primary" variant="contained" className={classes.button} onClick={() => data.agentSubscribe()}>Join</Button>
                  <Button color="primary" variant="contained" className={classes.button} onClick={() => data.agentUnSubscribe()}>Drop</Button>
                  <Button color="primary" variant="contained" className={classes.button} onClick={() => data.agentLoadLog()}>Logs</Button>
</>
}
                  {!data.agentName &&
                    <>
                    <br /><br /><br /><br />
                    </>
                  }
                </Paper>
              </Grid>






              <Grid item xs>
                <Paper className={classes.paper}>
                  <div>I am the <a target='_blank' rel='noopener noreferrer' href='https://www.dailymotion.com/video/xqrxql'>producer</a>!</div>

                  <FormControl className={classes.formControl}>
                    <InputLabel >Gender</InputLabel>
                    <Select
                      value={this.props.DataStore.notifyGender}
                      onChange={(e) => { this.props.DataStore.notifyGender = '' + e.target.value }}
                    >{g}</Select>
                  </FormControl>

                  <FormControl className={classes.formControl}>
                    <InputLabel >State</InputLabel>
                    <Select
                      value={this.props.DataStore.notifyState}
                      onChange={(e) => { this.props.DataStore.notifyState = '' + e.target.value }}
                    >{s}
                    </Select>
                  </FormControl>

                  <TextField className={classes.formControl}
                    label="Note"
                    value={this.props.DataStore.notifyNote}
                    onChange={(e) => { this.props.DataStore.notifyNote = '' + e.target.value }}
                  />

                  <Button color="primary" variant="contained" onClick={() => this.props.DataStore.notify()}>Notify</Button>
                </Paper>
              </Grid>










              {data.agentLog && data.agentLog.length > 0 &&
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <div>This is the <a target='_blank' rel='noopener noreferrer' href='https://pmcvariety.files.wordpress.com/2015/09/twinpeaks_loglady.jpg'>log</a> of events for agency {data.agentName} in {data.agentState}.</div>
                    <div style={{ maxHeight: 250, overflow: 'auto' }}>
                      <ul>
                        {data.agentLog.map((i: any) => 
                          <li id={i.id} className={classes.logEntry}>{i.msg}</li>
                        )}
                      </ul>
                    </div>
                  </Paper>
                </Grid>
              }


              
            </Grid>
          </Container>
        </div>


      </header>
    );
  }
}

// eslint-disable-next-line
export default withStyles(useStyles as any)(MainPage)
