// App.js
import React, { useState } from 'react';
import DataGridComponent from './DataGridComponent';
import Papa from 'papaparse';



const App = () => {
  const [csvData, setCsvData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [fileName, setFileName] = useState('');


  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);

      // Read the CSV file
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target.result;

        // Parse CSV data
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            setColumns(Object.keys(result.data[0]).map((col) => ({ key: col, Header: col })));
            setCsvData(result.data);
          },
        });
      };

      reader.readAsText(file);
    }
  };

  return (
    <div>
      <h1>CSV App</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {fileName && <p>Selected File: {fileName}</p>}
      {csvData.length > 0 && (
        <DataGridComponent columns={columns} data={csvData} onPageChange={() => {}} onPageSizeChange={() => {}} onEdit={() => {}} />
      )}
    </div>
  );
};

export default App;
