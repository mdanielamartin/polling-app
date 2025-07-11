import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'
import useUserStore from '../store/userStore';
import usePollStore from '../store/pollStore';


export const showLoginError = (message:string) => {
    const clearError = useUserStore.getState().clearError

    Swal.fire({
      icon: 'error',
      title: 'Login failed',
      text: message,
      confirmButtonColor: 'rgb(28, 28, 222)',
      confirmButtonText: 'Retry',
    }).then(()=>clearError());
  };



  export const showPollError = (message: string): void => {
    const clearError = usePollStore.getState().clearError
    Swal.fire({
      icon: 'error',
      title: 'Poll Error',
      text: message,
      confirmButtonColor: ' #FF6C40',
      confirmButtonText: 'Retry',
    }).then(()=>clearError());
  };


export const showRegistrationError = (message: string): void => {
    const clearError = useUserStore.getState().clearError
    Swal.fire({
      icon: 'error',
      title: 'Registration failed',
      text: message,
      confirmButtonColor: ' #FF6C40',
      confirmButtonText: 'Retry',
    }).then(()=>clearError());
  };


  export const noSelectionWarning = (): void => {
    Swal.fire({
      icon: "warning",
      title: 'No choice selected',
      text: "A choice must be selected ",
      confirmButtonColor: ' #FF6C40',
      confirmButtonText: 'Retry',
    });
  };


    export const voteError = (): void => {
    Swal.fire({
      icon: "error",
      title: 'Something went wrong on our end!',
      text: "Please try again later!",
      confirmButtonColor: ' #FF6C40',
      confirmButtonText: 'Close',
    });
  };
