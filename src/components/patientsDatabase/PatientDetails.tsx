import React, { Component } from "react";
import { Link as LinkRouter, RouteComponentProps } from "react-router-dom";
import _ from "lodash";

// local imports
import { MaterialButtonRouter } from "../utils/LinkHelper";
import styles from "./styles/PatientDetails.style";
import ListHeader from "../sharedComponents/ListHeader";
import AppoitmentsItem from "../sharedComponents/AppointmentsItem";
import SummaryItem from "../sharedComponents/SummaryItem";
import Calendar from "../../shared/lib/calendar/index";
import { PatientControllerApi, GetPatientUsingGETRequest } from '../../generate/apis';
import { Patient } from 'generate';

// material imports
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import Divider from "@material-ui/core/Divider";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
import Tooltip from '@material-ui/core/Tooltip';
import { Collapse, List } from '@material-ui/core';

// constants
import { 
    PATH_PATIENT_VISIT,
    PATH_PATIENT_ADMISSION,
    PATH_PATIENT_THERAPY,
    PATH_PATIENT_EXAMINATION,
    PATH_PATIENT_VACCINATION,
    PATH_OPD,
} from "../../config/constants"

export interface Props extends WithStyles<typeof styles> { }

interface State {
    labelWidth: number;
    error: any;
    isLoaded: boolean;
    item: Patient;
    openOptionalInfo: boolean;
}

interface Props {
    code: number
}

interface IRouteParams {
    id: string;
}

interface IProps extends RouteComponentProps<IRouteParams> { }

class PatientDetails extends Component<IProps> {
    state: State = {
        labelWidth: 0,
        error: null,
        isLoaded: false,
        openOptionalInfo: false,
        item: null
    };

    handleClickCollapseOptionalInfo = () => {
        this.setState(state => ({ openOptionalInfo: !state.openOptionalInfo }));
    };

    componentDidMount() {
        const patientController: PatientControllerApi = new PatientControllerApi();
        const param: GetPatientUsingGETRequest = {code: this.props.code}
        console.log("Ricevuto il codice "+this.props.code+" da prop");

        patientController.getPatientUsingGET(param).then(
            (result) => {
                console.log(result)
                this.setState({ isLoaded: true, item: result });
            },
            (error) => {
                console.error("cannot fetch patient: "+error);
              this.setState({ isLoaded: true, error });
            }
    }

    render() {
        const { classes } = this.props;
        
        const blankPatient = {
            isChronic: false,
            lastDocWhoVisitedHim: {
                name: "Marcus",
                surname: "Marcus",
                occupation: "Anesthesiologist",
                phone: "555 911 118",
                email: "doc@hospital.org",
            }
            firstName: "Antônio",
            secondName: "Carlos Jobim",
            code: 123456,
            age: 87,
            sex: "M",
            gender: "undefined",
            photo: null,
            bloodType: "A+",
            nextKin: "Jorge de Oliveira Jobim",
            notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            lastAdmission: "22.01.2019",
            reasonOfVisit: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
            treatment: "Bloodletting"
            address: "Rua do Catete 90, Glória, Rio de Janeiro - RJ"
        } //TODO this data has to be fetched from store after redux's ready */
        const patientInfo = (this.state.isLoaded) ? this.state.item : blankPatient;
        const { openOptionalInfo } = this.state;
        {openOptionalInfo ? <ExpandLess /> : <ExpandMore />;}
        return (
            <Grid item xs={12} sm={9} className={classes.patientContent}>
                <Grid item xs={12} className={classes.patientProfileHeader}>
                    <div style={{ flexDirection: "column", textAlign: "left" }}>
                        <Typography color="inherit" className={classes.patientName}>
                            {patientInfo.firstName} {patientInfo.secondName}
                        </Typography>
                        <Typography color="inherit" className={classes.patientAddress}>
                            Address: <b>{blankPatient.address}</b>
                        </Typography>
                    </div>
                    <MaterialButtonRouter component={LinkRouter} to={PATH_PATIENT_ADMISSION} variant="outlined" color="inherit" classes={{ root: classes.admissionButton }}>
                        New Admission
                    </MaterialButtonRouter>
                    <MaterialButtonRouter component={LinkRouter} to={PATH_PATIENT_VISIT} variant="outlined" color="inherit" classes={{ root: classes.visitButton }}>
                        New visit
                    </MaterialButtonRouter>
                </Grid>
                &emsp;
                <Divider className={classes.divider} />
                &emsp;
                <Grid item xs={12} className={classes.patientProfileHeader}>
                    <div style={{ flexDirection: "column", textAlign: "left" }}>
                        <Typography color="inherit" className={classes.patientRecord}>
                            PATIENT RECORD
                        </Typography>
                    </div>
                    <Tooltip title="View Opd patient History" interactive>
                        <MaterialButtonRouter component={LinkRouter} to={PATH_OPD} variant="outlined" color="inherit" classes={{ root: classes.opdButton }}>
                            OPD
                        </MaterialButtonRouter>
                    </Tooltip>
                    <Tooltip title="Add new patient's therapy" interactive>
                        <MaterialButtonRouter component={LinkRouter} to={PATH_PATIENT_THERAPY} variant="outlined" color="inherit" classes={{ root: classes.therapyButton }}>
                            Therapy
                        </MaterialButtonRouter>
                    </Tooltip>
                </Grid>
                &nbsp;
                <Grid container justify="center" spacing={24}>
                    <Calendar
                        accentColor={"red"}
                        orientation={"flex-row"}
                        showHeader={true}
                        onDatePicked={(d: any) => {
                        { onclick = this.handleClickCollapseOptionalInfo, d }
                        }}/>
                    <Collapse in={openOptionalInfo} style={{ width: "100%" }} timeout="auto">
                        <Grid item xs={12} justify="center">
                            <List classes={{ root: classes.appointments }}>
                                <ListHeader/>
                                <AppoitmentsItem/>
                                <AppoitmentsItem/>
                                <AppoitmentsItem/>
                            </List>
                        </Grid>
                    </Collapse>
                </Grid>
                <Grid item xs={12} spacing={24} style={{ marginTop: 50, marginBottom: 20 }} className={classes.detailButtonContainer}>
                    <MaterialButtonRouter
                        component={LinkRouter}
                        to="/Billing"
                        variant="contained"
                        color="secondary"
                        classes={{ root: classes.detailButton, label: classes.detailButtonLabelInverse }}>
                        <KeyboardArrowRightIcon/>
                            Pay the bill
                    </MaterialButtonRouter>
                    <MaterialButtonRouter
                        component={LinkRouter}
                        to={PATH_PATIENT_EXAMINATION}
                        variant="contained"
                        color="secondary"
                        classes={{ root: classes.detailButton, label: classes.detailButtonLabelInverse }}>
                        <KeyboardArrowRightIcon/>
                        Examination
                    </MaterialButtonRouter>
                    <MaterialButtonRouter
                        component={LinkRouter}
                        to={PATH_PATIENT_VACCINATION}
                        variant="contained"
                        color="secondary"
                        classes={{ root: classes.detailButton, label: classes.detailButtonLabelInverse }}>
                        <KeyboardArrowRightIcon/>
                        Vaccination
                    </MaterialButtonRouter>
                </Grid>
                &emsp;
                <Divider className={classes.divider} />
                &emsp;
                <Typography color="inherit" className={classes.patientSummary}>
                    PATIENT SUMMARY
                </Typography>
                &emsp;
                <Grid container className={classes.patientSummaryCard} style={{ width: "120%" }}>
                    <SummaryItem/>
                    <SummaryItem/>
                    <SummaryItem/>
                    <SummaryItem/>
                    <SummaryItem/>
                </Grid>
            </Grid>
        );
    }
}

const styledComponent = withStyles(styles, { withTheme: true })(PatientDetails);
export default styledComponent;
