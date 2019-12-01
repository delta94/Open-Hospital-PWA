import React, { Component } from "react";
import { Link as LinkRouter } from 'react-router-dom';

// local imports
import { MaterialButtonRouter, MaterialLinkRouter } from '../utils/LinkHelper';
import PatientsListItem from "./PatientsListItem";
import styles from './styles/PatientsDatabase.style';
import { PatientControllerApi, GetPatientsUsingGETRequest, GetPatientUsingGETRequest } from '../../generate/apis';
import { Patient } from 'generate';
import classNames from 'classnames';
import DeletePatientDialog from "./DeletePatientDialog";
import PatientBasicInfoForm from "../sharedComponents/PatientBasicInfoForm"
import BreadcrumbTrail from "../sharedComponents/BreadcrumbTrail"

// material imports
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import MergeIcon from '@material-ui/icons//LibraryBooks';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';

// constants
import { PATH_NEW_PATIENT } from "../../config/constants";

export interface Props extends WithStyles<typeof styles> {}

interface State {
    error: any;
    isLoaded: boolean;
    items: any[];
    selectedDate: any;
    patients: Array<Patient>;
    visible: number;
    searchedValue: String;
    isDeleteDialogOpen: boolean;
}

class PatientsDatabase extends Component<Props, State> {
    state: State = {
        error: null,
        isLoaded: false,
        items: [],
        selectedDate: new Date(),
        isDeleteDialogOpen: false,
        patients: new Array(),
        visible: 2,
        searchedValue: this.props.searchedValue
    };


    async updatedPatientCacheMessageHandler (event) {
        const {cacheName, updatedUrl} = event.data.payload;
        
        // Do something with cacheName and updatedUrl.
        // For example, get the cached content and update
        // the content on the page.
        const cache = await caches.open(cacheName);
        const updatedResponse = await cache.match(cache.updatedUrl);
        //const updatedText = await updatedResponse.text();
        console.log(updatedResponse);
        //alert("Nuovi dati aggiornati in background")


        //Let's re-render the PatientListItem components with updated
        //TODO
        
    }

    UNSAFE_componentWillMount() {
        const cacheUpdateChannel = new BroadcastChannel('patients-updates');
        cacheUpdateChannel.addEventListener('message', async (event) => this.updatedPatientCacheMessageHandler(event));
    }

   
    componentDidMount() {
        const patientController: PatientControllerApi = new PatientControllerApi();
        const requestParams: GetPatientsUsingGETRequest = { page: 1, size: this.state.visible }
        

        //LOAD WITH FETCH
        /* fetch('https://cors-anywhere.herokuapp.com/https://www.open-hospital.org/oh-api/patients?page=1&size=10',
            {
                method: 'GET', 
                headers: new Headers({
                    'Authorization': 'Basic b2g6b2xkcGVhY2g1Nw==', 
                    })
            })
                .catch(err => console.error('Cannot fetch the patients data: '+err))
                .then(res => res.json())
                .then(json => {
                    //console.log(json);
                    this.setState({ isLoaded: true, items: json })
                })
                .catch(err => console.error('Misformed data: '+err));
                 */

        // USE THE REMOTE API SERVER
        patientController.getPatientsUsingGET(requestParams).then(
            (result) => {
                //cache the patient json too
                for (let p in result) {
                    let patient = result[p]
                    const param: GetPatientUsingGETRequest = {code: patient.code}
                    patientController.getPatientUsingGET(param);
                }
                
                this.setState({ isLoaded: true, items: result, });
            },
            (error) => {
              this.setState({ isLoaded: true, error });
            }
        );
    }

    keywordInput = (classes, classNames) => {
        // this function defines an extra input for PatientBasicInfoForm
        return (
            <Grid item xs={12} sm={3}>
                <TextField
                    id="keyword"
                    label="Keyword"
                    className={classNames(classes.formField, classes.cssOutlinedInput)}
                    placeholder="First name, last name, tax number..."
                    InputLabelProps={{
                        classes: {
                            root: classes.formFieldInputLabel,
                            focused: classes.cssFocused,
                        },
                    }}
                    InputProps={{
                        classes: {
                            root: classes.formFieldInput,
                            notchedOutline: classes.cssOutlinedInput,
                        },
                    }}
                    margin="normal"
                    variant="outlined"/>
            </Grid>
        )
    }

    public render() {
        const { classes, theme } = this.props;
        const { items, isLoaded, error, isDeleteDialogOpen } = this.state;
        return (
            <div className={classes.root}>
                <Grid container className={classes.gridContainer} justify='center' spacing={24}>
                    <Grid container item justify='center' spacing={24}>
                        <Grid item xs={12}>
                            <BreadcrumbTrail/>
                        </Grid>
                        <Grid item xs={12} className={classes.patientActions}>
                            <Typography variant="inherit" className={classes.patientsTitle}>
                                PATIENTS
                            </Typography>
                            <Grid>
                                <Button color="inherit" 
                                    onClick={() => this.setState({ isDeleteDialogOpen: true })} 
                                    classes={{ root: classes.button, label: classes.buttonLabel }}>
                                    <CancelIcon className={classes.buttonIcon} />
                                    Delete a patient
                                </Button>
                                <DeletePatientDialog 
                                    isOpen={isDeleteDialogOpen} 
                                    handleClickClose={() => this.setState({ isDeleteDialogOpen: false })}/>
                            </Grid>                  
                            <MaterialButtonRouter component={LinkRouter} to={PATH_NEW_PATIENT} color="inherit" classes={{ root: (classNames(classes.button, 'addButton')), label: classes.buttonLabel }}>
                                <AddIcon className={classes.buttonIcon} />
                                Record new patient
                            </MaterialButtonRouter>
                            <Button color="inherit" classes={{ root: (classNames(classes.button, 'mergeButton')), label: classes.buttonLabel }}>
                                <MergeIcon className={classes.buttonIcon} />
                                Merge double patients' registration
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container item justify='center' spacing={24}>
                        <Paper className={classes.paperFlat}>
                            <Grid container item spacing={24} className={classes.inputContainer}>
                                <Grid item xs={12} style={{ display: 'flex' }}>
                                    <Typography variant="inherit" className={classes.findPatients}>
                                        FIND A PATIENT
                                    </Typography>
                                    <Typography variant="inherit" className={classes.insertInfoPatients}>
                                        Insert the patient's information
                                    </Typography>
                                </Grid>
                            </Grid>
                            <PatientBasicInfoForm extraInput={this.keywordInput}/>
                        </Paper>
                    </Grid>
                    <Grid container item spacing={24} className={classes.filterContainer}>
                        <Grid item xs={12} style={{ display: 'flex' }}>
                            <Typography variant="inherit" className={classes.findPatients}>
                                Which patient are you searching for?
                            </Typography>
                            <Typography variant="inherit" className={classes.insertInfoPatients}>
                                Use the filters for a faster search
                            </Typography>
                        </Grid>
                        <Divider className={classes.divider} />
                        <Grid item xs={12} sm={3}>
                            <FormControl variant="outlined" className={classNames(classes.formField, classes.formFieldSelect)}>
                                <Select
                                    className={classes.select}
                                    input={<OutlinedInput
                                                placeholder="soma"
                                                labelWidth={300} //{this.state.InputLabelRef}
                                                name="filter"
                                                id="filter"
                                                enableSearch                   
                                                classes={{
                                                    input: classes.formFieldSelectInput}}/>}>
                                    <MenuItem value={10}>Chronic Patient</MenuItem>
                                    <MenuItem value={20}>Properly admission</MenuItem>
                                    <MenuItem value={30}>Visited this month</MenuItem>
                                    <MenuItem value={30}>Visited last month</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container item style={{ padding: '47px 0' }} spacing={24}>
                        {items && items.length !== 0 ?
                            (items.map((item) => (<PatientsListItem info={item}/>)))
                            :
                            <CircularProgress className={classes.progress} color="secondary" style={{ margin: '20px auto' }}/>}
                    </Grid>
                    <Grid item xs={12} sm={2} className={classes.loadMoreContainer}>
                        <Button type="button" variant="outlined" color="inherit" classes={{ root: classes.button, label: classes.buttonLabel }}>
                            Load more
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const styledComponent = withStyles(styles, { withTheme: true })(PatientsDatabase);
export default styledComponent;