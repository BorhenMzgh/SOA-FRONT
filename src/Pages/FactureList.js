import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './FactureList.css';
import { Link } from 'react-router-dom';


Modal.setAppElement('#root');

const FactureList = () => {
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [isAddFactureModalOpen, setAddFactureModalOpen] = useState(false);
  const [isUpdateFactureModalOpen, setUpdateFactureModalOpen] = useState(false);
  const [newFacture, setNewFacture] = useState({
    numeroFacture: '',
    montant: 0,
    dateFacturation: new Date().toISOString().split('T')[0],
    client: {},
  });
  const [selectedFacture, setSelectedFacture] = useState({
    numeroFacture: '',
    montant: 0,
    dateFacturation: new Date().toISOString().split('T')[0],
    client: {},
  });

  useEffect(() => {
    fetchFactures();
    fetchClients();
  }, []);

  const fetchFactures = async () => {
    try {
      const facturesResponse = await axios.get('http://localhost:8080/factures/');
      const facturesData = facturesResponse.data;
  
      const facturesWithClientInfo = await Promise.all(
        facturesData.map(async (facture) => {
          if (facture.client) {
            const clientResponse = await axios.get(`http://localhost:8080/clients/${facture.client.id}`);
            const clientInfo = clientResponse.data;
            return { ...facture, clientId: clientInfo.id, clientName: `${clientInfo.nom} ${clientInfo.prenom}` };
          } else {
            return { ...facture, clientId: null, clientName: 'Unknown Client' };
          }
        })
      );
  
      setFactures(facturesWithClientInfo);
    } catch (error) {
      console.error('Error fetching factures:', error);
    }
  };
  

  const fetchClients = async () => {
    try {
      const clientsResponse = await axios.get('http://localhost:8080/clients/');
      setClients(clientsResponse.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const deleteFacture = (id) => {
    axios.get(`http://localhost:8080/factures/delete/${id}`)
      .then(() => {
        console.log(`Facture with ID ${id} deleted`);
        fetchFactures();
      })
      .catch(error => console.error('Error deleting facture:', error));
  };

  const updateFacture = () => {
    fetch(`http://localhost:8080/factures/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedFacture),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        console.log(`Facture with ID ${selectedFacture.id} updated`);
        fetchFactures();
        setUpdateFactureModalOpen(false);
        setSelectedFacture(null);
      })
      .catch((error) => console.error('Error updating facture:', error));
  };
  

  const createFacture = () => {
    axios.post('http://localhost:8080/factures/', newFacture)
      .then(() => {
        console.log('New facture created');
        fetchFactures();
        setAddFactureModalOpen(false);
        setNewFacture({
          numeroFacture: '',
          montant: 0,
          dateFacturation: new Date().toISOString().split('T')[0],
        });
      })
      .catch(error => console.error('Error creating facture:', error));
  };

  const openUpdateModal = (facture) => {
    setUpdateFactureModalOpen(true);
    setSelectedFacture(facture);
  };

  const closeUpdateModal = () => {
    setUpdateFactureModalOpen(false);
    setSelectedFacture(null);
  };

  return (
    <div className="facture-list-container">
      <h1>List of Factures</h1>

      <button className="add-button" onClick={() => setAddFactureModalOpen(true)}>
        Add Facture (+)
      </button>

      <Modal
        isOpen={isAddFactureModalOpen}
        onRequestClose={() => setAddFactureModalOpen(false)}
        contentLabel="Add Facture Modal"
        className="add-facture-modal"
      >
        <form>
          <label>Numero Facture:</label>
          <input
            type="text"
            value={newFacture.numeroFacture}
            onChange={(e) => setNewFacture({ ...newFacture, numeroFacture: e.target.value })}
          />

          <label>Montant:</label>
          <input
            type="number"
            value={newFacture.montant}
            onChange={(e) => setNewFacture({ ...newFacture, montant: e.target.value })}
          />

          <label>Date Facturation:</label>
          <input
            type="date"
            value={newFacture.dateFacturation}
            onChange={(e) => setNewFacture({ ...newFacture, dateFacturation: e.target.value })}
          />

<label>Client:</label>
<select
  value={newFacture.client ? newFacture.client.id : 0}
  onChange={(e) => {
    const selectedClientId = Number(e.target.value);
    const selectedClient = clients.find(client => client.id === selectedClientId);
    setNewFacture({ ...newFacture, client: selectedClient });
    console.log(selectedClient);
  }}
>
  <option value={0} disabled>Select a client</option>
  {clients.map(client => (
    <option key={client.id} value={client.id} selected={newFacture.client && client.id === newFacture.client.id}>
      {`${client.nom} ${client.prenom}`}
    </option>
  ))}
</select>




          <button className="add-button" type="button" onClick={createFacture}>
            Add
          </button>
          <button className="cancel-button" type="button" onClick={() => setAddFactureModalOpen(false)}>
            Cancel
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isUpdateFactureModalOpen}
        onRequestClose={closeUpdateModal}
        contentLabel="Update Facture Modal"
        className="add-facture-modal"
      >
        <form>
          <label>Numero Facture:</label>
          <input
            type="text"
            value={selectedFacture?.numeroFacture || ''}
            onChange={(e) => setSelectedFacture({ ...selectedFacture, numeroFacture: e.target.value })}
          />

          <label>Montant:</label>
          <input
            type="number"
            value={selectedFacture?.montant || 0}
            onChange={(e) => setSelectedFacture({ ...selectedFacture, montant: e.target.value })}
          />

          <label>Date Facturation:</label>
          <input
            type="date"
            value={selectedFacture?.dateFacturation || new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedFacture({ ...selectedFacture, dateFacturation: e.target.value })}
          />

<label>Client:</label>
<select
  value={selectedFacture?.client?.id || ''} 
  onChange={(e) => {
    const selectedClientId = Number(e.target.value);
    const selectedClient = clients.find(client => client.id === selectedClientId);
    setSelectedFacture({ ...selectedFacture, client: selectedClient });
    console.log(selectedClient);
  }}
>
  <option value={0} disabled>Select a client</option>
  {clients.map(client => (
    <option key={client.id} value={client.id}>
      {`${client.nom} ${client.prenom}`}
    </option>
  ))}
</select>


          <button className="add-button" type="button" onClick={() => updateFacture(selectedFacture)}>
            Update
          </button>
          <button className="cancel-button" type="button" onClick={closeUpdateModal}>
            Cancel
          </button>
        </form>
      </Modal>

      <table className="facture-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Numero Facture</th>
            <th>Montant</th>
            <th>Date Facturation</th>
            <th>Client Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {factures.map(facture => (
            <tr key={facture.id}>
              <td>{facture.id}</td>
              <td>{facture.numeroFacture}</td>
              <td>{facture.montant}</td>
              <td>{facture.dateFacturation}</td>
              <td>
              <Link
                  to={`/getFactures/${facture.client.id}`} // Include clientId in the URL
                  onClick={() => console.log('Sending client ID:', facture.client.id)}
                >
                  {facture.clientName}
                </Link>
              </td>
              <td>
                <div className="facture-actions">
                  <button
                    className="delete-button"
                    onClick={() => deleteFacture(facture.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="update-button"
                    onClick={() => openUpdateModal(facture)}
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

export default FactureList;
