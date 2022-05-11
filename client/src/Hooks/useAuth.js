import { useContext } from 'react';
import { Context } from '../Components/providers/AuthProvider/AuthProvider';

const useAuth = () => useContext(Context);

export default useAuth;