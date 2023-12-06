import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ClientList.css';

Modal.setAppElement('#root');

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [isAddClientModalOpen, setAddClientModalOpen] = useState(false);
  const [isUpdateClientModalOpen, setUpdateClientModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    nom: '',
    prenom: '',
    num: '',
    adress: '',
    etat: true,
  });
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    axios.get('http://localhost:8080/clients/')
      .then(response => {
        console.log(response.data);
        setClients(response.data);
      })
      .catch(error => console.error('Error fetching clients:', error));
  };

  const deleteClient = (id) => {
    axios.delete(`http://localhost:8080/clients/${id}`)
      .then(() => {
        console.log(`Client with ID ${id} deleted`);
        fetchClients();
      })
      .catch(error => console.error('Error deleting client:', error));
  };

  const updateClient = (updatedClient) => {
    axios.put(`http://localhost:8080/clients/${updatedClient.id}`, updatedClient)
      .then(() => {
        console.log(`Client with ID ${updatedClient.id} updated`);
        fetchClients();
        setUpdateClientModalOpen(false);
        setSelectedClient(null);
      })
      .catch(error => console.error('Error updating client:', error));
  };

  const createClient = () => {
    axios.post('http://localhost:8080/clients/', newClient)
      .then(() => {
        console.log('New client created');
        fetchClients();
        setAddClientModalOpen(false);
        setNewClient({
          nom: '',
          prenom: '',
          num: '',
          adress: '',
          etat: true,
        });
      })
      .catch(error => console.error('Error creating client:', error));
  };

  const openUpdateModal = (client) => {
    setUpdateClientModalOpen(true);
    setSelectedClient(client);
  };

  const closeUpdateModal = () => {
    setUpdateClientModalOpen(false);
    setSelectedClient(null);
  };

  return (
    <div className="client-list-container">
      <h1>List of Clients</h1>

      <button className="add-button" onClick={() => setAddClientModalOpen(true)}>
        Add Client (+)
      </button>

      <Modal
        isOpen={isAddClientModalOpen}
        onRequestClose={() => setAddClientModalOpen(false)}
        contentLabel="Add Client Modal"
        className="add-client-modal"
      >
       <form>
          <label>Nom:</label>
          <input
            type="text"
            value={newClient.nom}
            onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })}
          />

          <label>Prénom:</label>
          <input
            type="text"
            value={newClient.prenom}
            onChange={(e) => setNewClient({ ...newClient, prenom: e.target.value })}
          />

          <label>Num:</label>
          <input
            type="text"
            value={newClient.num}
            onChange={(e) => setNewClient({ ...newClient, num: e.target.value })}
          />

          <label>Adresse:</label>
          <input
            type="text"
            value={newClient.adress}
            onChange={(e) => setNewClient({ ...newClient, adress: e.target.value })}
          />

          <label>État:</label>
          <select
            value={newClient.etat ? 'Active' : 'Inactive'}
            onChange={(e) => setNewClient({ ...newClient, etat: e.target.value === 'Active' })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button className="add-button" type="button" onClick={createClient}>
                              Add
                     </button>
          <button className="cancel-button" type="button" onClick={() => setAddClientModalOpen(false)}>
                            Cancel
              </button>

        </form>
      </Modal>

      <Modal
        isOpen={isUpdateClientModalOpen}
        onRequestClose={closeUpdateModal}
        contentLabel="Update Client Modal"
        className="add-client-modal" // You can reuse the same modal style
      >
        <form>
          <label>Nom:</label>
          <input
            type="text"
            value={selectedClient?.nom || ''}
            onChange={(e) => setSelectedClient({ ...selectedClient, nom: e.target.value })}
          />

          <label>Prénom:</label>
          <input
            type="text"
            value={selectedClient?.prenom || ''}
            onChange={(e) => setSelectedClient({ ...selectedClient, prenom: e.target.value })}
          />

          <label>Num:</label>
          <input
            type="text"
            value={selectedClient?.num || ''}
            onChange={(e) => setSelectedClient({ ...selectedClient, num: e.target.value })}
          />

          <label>Adresse:</label>
          <input
            type="text"
            value={selectedClient?.adress || ''}
            onChange={(e) => setSelectedClient({ ...selectedClient, adress: e.target.value })}
          />

          <label>État:</label>
          <select
            value={selectedClient?.etat ? 'Active' : 'Inactive'}
            onChange={(e) => setSelectedClient({ ...selectedClient, etat: e.target.value === 'Active' })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button className="add-button" type="button" onClick={() => updateClient(selectedClient)}>
            Update
          </button>
          <button className="cancel-button" type="button" onClick={closeUpdateModal}>
            Cancel
          </button>
        </form>
      </Modal>

      <table className="client-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Num</th>
            <th>Adresse</th>
            <th>État</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.nom}</td>
              <td>{client.prenom}</td>
              <td>{client.num}</td>
              <td>{client.adress}</td>
              <td>{client.etat ? 'Active' : 'Inactive'}</td>
              <td>
                <div className="client-actions">
                  <button
                    className="delete-button"
                    onClick={() => deleteClient(client.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="update-button"
                    onClick={() => openUpdateModal(client)}
                  >
                    Update
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
