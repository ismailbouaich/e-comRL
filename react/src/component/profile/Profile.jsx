import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";
import { orderHistory } from '../../redux/actions/orderActions';
import OrderList from './OrderList';
import LoadingSpinner from '../../components/LoadingSpinner';
import EditUser from './EditUser';

import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../redux/actions/userActions';





const OrderHistoryContainer = ({ userId, children }) => {
  const dispatch = useDispatch();
 



  useEffect(() => {
    dispatch(orderHistory(userId));
  }, [dispatch, userId]);

  return children;
};





const Profile = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.order.orders);

const handleLogout = () => {
  dispatch(logoutUser());
  navigate('/login');
};
 useEffect(() => {
    if (!localStorage.getItem('token')) {
      return navigate('/login');
    }
  }, [navigate]);


  if (!user) {
    return <div><LoadingSpinner/></div>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 xl:py-12">
      <div className="container mx-auto">
        <Tabs defaultValue="experience" className="flex flex-col xl:flex-row gap-[60px]">
          <TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6">
            <TabsTrigger value="experience">Dashboard</TabsTrigger>
            <TabsTrigger value="Orders">Orders</TabsTrigger>
            <TabsTrigger value="Edit Profile">Change Profile</TabsTrigger>
            <TabsTrigger value="about" onClick={handleLogout}>LogOut</TabsTrigger>
          </TabsList>

          <div className="min-h-[70vh] w-full">
            <TabsContent value="experience" className="w-full">
              
            </TabsContent>

            <TabsContent value="Orders" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">History of the Orders</h3>
                <p className="max-w-[600px] text-black/90 mx-auto xl:mx-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, eaque!</p>
                <ScrollArea className="h-[400px]">
                  <OrderHistoryContainer userId={user.id}>
                   <OrderList />
                  </OrderHistoryContainer>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="Edit Profile" className="w-full h-full">
             <EditUser user={user}/>
            </TabsContent>

           
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
