import React from "react";
// import Avatar from '@material-ui/core/Avatar';
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link as RouterLink } from "react-router-dom";
import validate from './LoginFormValidationRules'
import useForm from './useForm'

function login() {
  // eslint-disable-next-line no-console
  console.log('No errors, submit callback called!')
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const { values, errors, handleChange, handleSubmit } = useForm(
    login,
    validate
  )

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img
          src={`${process.env.PUBLIC_URL}/carlogo.png`}
          alt="Logo"
          width="400"
          height="150"
        />

        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <TextField
            className={`input ${errors.username }`}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="User Name"
            name="username"
            autoComplete="username"
            onChange={handleChange}
            value={values.username || ''}
            autoFocus
          />
          {errors.username && (
                <p style={{ color: "red" }} > {errors.username}</p>
              )}
          <TextField
            className={`input ${errors.password}`}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={handleChange}
            value={values.password || ''}
            autoComplete="current-password"
          />
          {errors.password && (
                <p style={{ color: "red" }}>{errors.password}</p>
              )}
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            to="/Dashboard"
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item xs>
              <Link
                href="/#"
                variant="body2"
                component={RouterLink}
                to="/ForgotPassword"
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                href="/#"
                component={RouterLink}
                variant="body2"
                to="/Register"
              >
                Do not have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
