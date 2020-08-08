
import React from 'react';
import { Button, Form, Icon, Message, Segment } from 'semantic-ui-react';
import Link from 'next/link';
import catchErrors from '../utils/catchErrors';
import baseUrl from '../utils/baseUrl';
import axios from 'axios';
import {handleLogin} from '../utils/auth';


const INITIAL_USER = {
  email:"",
  password:""
}





function Signup() {

  const [user, setUser] = React.useState(INITIAL_USER);
  const [disabled, setDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    const isUser = Object.values(user).every(el => Boolean(el));
    isUser ? setDisabled(false) : setDisabled(true)
  }, [user])
 

  function handleChange(e) {
    const {name, value} = event.target

    setUser(prevState => ({...prevState, [name]: value}))
  }

  async function handleSubmit(e){
    e.preventDefault();
    

    try{
      // make request to signup user
      setLoading(true)
      setError('')
      const url = `${baseUrl}/api/login`
      const payload = {...user}
      const response = await axios.post(url, payload);
      handleLogin(response.data);
    } catch (error){
      catchErrors(error, setError)

    } finally{
      setLoading(false)
    }
  }


  return <>
      <Message
        attached
        icon="privacy"
        header="Content de vous revoir!"
        content="Se connecter avec votre mail et votre mot de passe"
        color="teal"
      />
      <Form error={Boolean(error)} onSubmit={handleSubmit}>
      <Message
        error
        header="Oops!"
        content={error}
      />  
        <Segment>
          <Form.Input
            fluid
            icon="envelope"
            iconPosition="left"
            label="Email"
            placeholder="Email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}

          />
            <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            label="Password"
            placeholder="Password"
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}

          />
          <Button
            icon="sign in"
            type="submit"
            color="orange"
            content="Se connecter"
            disabled={disabled || loading}
          />  
        </Segment>
      </Form>  
      <Message attached="bottom" warning>
          <Icon name="help"/>
          Nouveau client? ? {" "}
          <Link href="/signup">
            <a>S'enregistrer</a>
          </Link>
      </Message>
  </>;
}

export default Signup;
