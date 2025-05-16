import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LashesIntro from './components/LashesIntro';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import ClientStats from './components/ClientStats';
import AppointmentForm from './components/AppointmentForm';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('clients');
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const storedClients = JSON.parse(localStorage.getItem('macaLashesClients')) || [];
    const storedAppointments = JSON.parse(localStorage.getItem('macaLashesAppointments')) || [];
    setClients(storedClients);
    setAppointments(storedAppointments);
  }, []);

  const handleSaveClient = (clientData) => {
    const updatedClients = [...clients];
    if (editingIndex !== null) {
      updatedClients[editingIndex] = clientData;
    } else {
      updatedClients.push(clientData);
    }
    
    localStorage.setItem('macaLashesClients', JSON.stringify(updatedClients));
    setClients(updatedClients);
    setCurrentView('clients');
    setEditingIndex(null);
  };

  const handleSaveAppointment = (appointmentData) => {
    const updatedAppointments = [...appointments, {
      ...appointmentData,
      clientId: selectedClient.id || selectedClient.name
    }];
    
    localStorage.setItem('macaLashesAppointments', JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments);
    setCurrentView('appointments');
    setSelectedClient(null);
  };

  const handleDelete = (index, type) => {
    if (type === 'client') {
      const updatedClients = clients.filter((_, i) => i !== index);
      localStorage.setItem('macaLashesClients', JSON.stringify(updatedClients));
      setClients(updatedClients);
    } else {
      const updatedAppointments = appointments.filter((_, i) => i !== index);
      localStorage.setItem('macaLashesAppointments', JSON.stringify(updatedAppointments));
      setAppointments(updatedAppointments);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pb-10">
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <>
          <LashesIntro />
          
          <div className="flex justify-center space-x-4 mb-6 mt-6">
            <button
              onClick={() => {
                setEditingIndex(null);
                setCurrentView('clients');
              }}
              className={`px-6 py-2 rounded-full ${currentView === 'clients' ? 'bg-pink-600 text-white' : 'bg-white text-pink-600 border-2 border-pink-600'}`}
            >
              Clientes
            </button>
            <button
              onClick={() => {
                setEditingIndex(null);
                setCurrentView('newClient');
              }}
              className={`px-6 py-2 rounded-full ${currentView === 'newClient' ? 'bg-pink-600 text-white' : 'bg-white text-pink-600 border-2 border-pink-600'}`}
            >
              Nueva Clienta
            </button>
            <button
              onClick={() => setCurrentView('appointments')}
              className={`px-6 py-2 rounded-full ${currentView === 'appointments' ? 'bg-pink-600 text-white' : 'bg-white text-pink-600 border-2 border-pink-600'}`}
            >
              Turnos
            </button>
          </div>

          {currentView === 'newClient' ? (
            <ClientForm 
              clientToEdit={editingIndex !== null ? clients[editingIndex] : null}
              onSave={handleSaveClient}
            />
          ) : currentView === 'newAppointment' ? (
            <AppointmentForm 
              client={selectedClient}
              onSave={handleSaveAppointment}
              onCancel={() => setCurrentView('clients')}
            />
          ) : currentView === 'appointments' ? (
            <>
              <ClientStats clients={clients} appointments={appointments} />
              <ClientList 
                clients={appointments.map(apt => ({
                  ...apt,
                  name: clients.find(c => c.id === apt.clientId)?.name || apt.clientId
                }))} 
                onEdit={(index) => {
                  setEditingIndex(index);
                  setCurrentView('newAppointment');
                }}
                onDelete={(index) => handleDelete(index, 'appointment')}
                isAppointmentList
              />
            </>
          ) : (
            <>
              <ClientStats clients={clients} />
              <ClientList 
                clients={clients} 
                onEdit={(index) => {
                  setEditingIndex(index);
                  setCurrentView('newClient');
                }}
                onDelete={(index) => handleDelete(index, 'client')}
                onSelect={(client) => {
                  setSelectedClient(client);
                  setCurrentView('newAppointment');
                }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;