import React, { useEffect } from 'react';

function getRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function InputSection({ data, setData }) {

  useEffect(() => {
    localStorage.setItem('sankeyData', JSON.stringify(data));
  }, [data]);

  console.log(data, 'data');

  const handleInputChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const addRow = () => {
    setData([...data, { from: '', to: '', value: '', color: getRandomColor() }]);
  };

  const clearData = () => {
    setData([{ from: '', to: '', value: '', color: getRandomColor() }]);
    localStorage.removeItem('sankeyData');
  };

  return (
    <section>
      <h1>Sankey Generator</h1>
      <table>
        <thead>
          <tr>
            <th>Source Node</th>
            <th>Target Node</th>
            <th>Value</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  value={row.from}
                  onChange={(e) => handleInputChange(index, 'from', e.target.value)}
                />
              </td>
              <td>
                <input
                  value={row.to}
                  onChange={(e) => handleInputChange(index, 'to', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.value}
                  onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                />
              </td>
              <td>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={row.color || '#000000'}
                    onChange={(e) => handleInputChange(index, 'color', e.target.value)}
                  />
                
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>New Row</button>
      <button onClick={clearData}>Clear Input</button>

      <style jsx>{`
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        input[type="text"], input[type="number"] {
          width: 100%;
          padding: 5px;
          box-sizing: border-box;
        }
        .color-picker-wrapper {
          display: flex;
          align-items: center;
        }
        input[type="color"] {
          width: 30px;
          height: 30px;
          padding: 0;
          border: none;
          background: none;
          -webkit-appearance: none;
        }
        input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        input[type="color"]::-webkit-color-swatch {
          border: none;
          border-radius: 50%;
        }
          
        button {
          margin-top: 10px;
          padding: 5px 10px;
          background-color: #4CAF50;
          color: white;
          border: none;
          cursor: pointer;
          margin-right: 10px;
        }
        button:hover {
          background-color: #45a049;
        }
      `}</style>
    </section>
  );
}

export default InputSection;
