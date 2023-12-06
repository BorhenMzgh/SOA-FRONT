import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './GetFactures.css'; // Import your CSS file for styling

const GetFactures = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientResponse = await axios.get(`http://localhost:8080/clients/${clientId}`);
        setClient(clientResponse.data);
        console.log("client: ", clientResponse.data);

        const facturesResponse = await fetch('http://localhost:8080/factures/getFactures', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clientResponse.data),
        });

        if (!facturesResponse.ok) {
          throw new Error(`Error: ${facturesResponse.status}`);
        }

        const facturesData = await facturesResponse.json();
        setFactures(facturesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (clientId) {
      fetchData();
    }
  }, [clientId]);

  return (
    <div className="factures-container">
      <h1>Client Factures</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="client-info">
            {client ? (
              <>
                <h2>Client Information</h2>
                <p>ID: {client.id}</p>
                <p>Name: {client.nom} {client.prenom}</p>
                {/* Add more client details as needed */}
              </>
            ) : (
              <p>No client data available.</p>
            )}
          </div>

          <div className="factures-table">
            <h2>Factures for Client: {client ? `${client.nom} ${client.prenom}` : 'Unknown Client'}</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Numero Facture</th>
                  <th>Montant</th>
                  <th>Date Facturation</th>
                </tr>
              </thead>
              <tbody>
                {factures.map((facture) => (
                  <tr key={facture.id}>
                    <td>{facture.id}</td>
                    <td>{facture.numeroFacture}</td>
                    <td>{facture.montant}</td>
                    <td>{facture.dateFacturation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default GetFactures;
