export default function validate(values) {
  const errors = {}
  if (!values.username) {
    errors.username = 'User Name is required'
  }
  if (!values.email) {
    errors.email = 'Email address is required'
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid'
  }
  if (!values.password) {
    errors.password = 'Password is required'
  } else if (values.password.length < 8) {
    errors.password = 'Password must be 8 or more characters'
  }

  if (!values.confirmpassword) {
    errors.confirmpassword = 'Confirmed Password is required'
  } else if (values.confirmpassword.length < 8) {
    errors.confirmpassword = 'Confirmed Password must be 8 or more characters'
  }else if (values.password !== values.confirmpassword) {
    errors.confirmpassword = 'Passwords Must Match'
  }
  
  
  return errors
}
