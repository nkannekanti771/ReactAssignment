// DataGridComponent.js
import React, { useState, useEffect } from 'react';

const DataGridComponent = ({ columns, data, onPageChange, onPageSizeChange, onEdit, onSave }) => {
  const pageSizeOptions = [5, 10, 20];
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [editedItem, setEditedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Reset current page to 1 when the search term changes
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const filteredData = data.filter((row) => {
    return columns.some((column) =>
      String(row['Company Name']).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


  useEffect(() => {
    const storedItem = localStorage.getItem('editedItem');
    if (storedItem) {
      setEditedItem(JSON.parse(storedItem));
    }
  }, []);

  useEffect(() => {
    if (editedItem) {
      localStorage.setItem('editedItem', JSON.stringify(editedItem));
    }
  }, [editedItem]);

  const handleEditClick = (item) => {
    setEditedItem(item);
    onEdit(item);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    onPageSizeChange(newPageSize);
  };


  const handleSaveClick = () => {
    setEditedItem(null);
  };

  const handleCellValueChange = (columnKey, newValue, row, value) => {
     data[data.indexOf(row)][columnKey] = newValue
      };

  const renderEditableCell = (value, row, columnKey) => (
    <div
      className="editable-cell"
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => handleCellValueChange(columnKey, e.target.innerText,row,value)}
    >
      {value}
    </div>
  );

  const renderEditButton = (row) => (
    <button className="edit-button" onClick={() => handleEditClick(row)}>
      Edit
    </button>
  );

  const renderSaveButton = () => (
    <button className="edit-button" onClick={handleSaveClick}>
      Save
    </button>
  );

  const renderPageSizeOptions = () => {
    return pageSizeOptions.map((size) => (
      <option key={size} value={size}>
        {size} items
      </option>
    ));
  };


  const renderCustomCell = (value, row, columnKey) => {
  const cellStyle = {
    color: value < 0 ? 'red' : 'green', 
    fontWeight: 'bold',
  };

  const formattedValue = manipulateCellValue(value); 

  return (
    <div className="custom-cell" style={cellStyle}>
      {formattedValue}
    </div>
  );
};

const manipulateCellValue = (value) => {
  // Implement your logic to manipulate the cell value
  return `Formatted: ${value}`;
};

  const renderTableRows = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const displayedData = filteredData.slice(startIndex, endIndex);

    return displayedData.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {columns.map((column) => (
          <td key={column.key}>
            {editedItem === row
              ? renderEditableCell(row[column.key], row, column.key)
              : row[column.key]}
          </td>
        ))}
        <td>
          {editedItem === row ? renderSaveButton() : renderEditButton(row)}
        </td>
      </tr>
    ));
  };

  return (
    <div>
    <div className="search-container">
        <label htmlFor="searchInput">Search:</label>
        <input
          type="text"
          id="searchInput"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Company Name"
        />
      </div>
      <table className="data-grid">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.Header}</th>
            ))}
            <th>{editedItem ? 'Save' : 'Edit'}</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
      <div className="pagination">
        <span>
          Page {currentPage} of {Math.ceil(data.length / pageSize)} |
        </span>
        <span>
          Go to page:
          <input
            type="number"
            value={currentPage}
            onChange={(e) => handlePageChange(parseInt(e.target.value, 10))}
            className="page-input"
          />
        </span>
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(parseInt(e.target.value, 10))}
          className="page-size-select"
        >
          {renderPageSizeOptions()}
        </select>
      </div>
    </div>
  );
};

export default DataGridComponent;









 



       







