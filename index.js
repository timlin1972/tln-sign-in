import React, { useState }  from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { useMutation, gql } from '@apollo/client';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import { useTranslation } from 'react-i18next';

import * as actions from '../src/state/actions';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const M_LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      err
      token
      user {
        id
        username
        role
        language
        logoutTimeout
      }
    }
  }
`;

const SignIn = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [login, { data, loading, error }] = useMutation(M_LOGIN);

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');

  const handleClick = () => {
    login({ variables: { username, password } })
      .then((ret) => {
        const { data } = ret;
        const { login } = data;

        if (login.err) {
          window.alert(login.err);
        }
        else {
          const { user, token } = login;

          localStorage.setItem('token', token);
    
          props.setUser({
            login: true,
            id: user.id,
            username: user.username,
            role: user.role,
            language: user.language,
            logoutTimeout: user.logoutTimeout,
          });          
        }
      })
      .catch((err) => console.log(err));
  }

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  }

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t('Sign in')}
        </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label={t("Username")}
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={handleChangeUsername}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={t("Password")}
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handleChangePassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleClick}
          >
            {t('Sign In')}
          </Button>
      </Paper>
    </Container>
  );
}

function mapStateToProps(/* state */) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: bindActionCreators(actions.setUser, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
