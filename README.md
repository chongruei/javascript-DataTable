# javascript-DataTable

-   Demo: [javascript-DataTable](https://chongruei.github.io/javascript-DataTable/)

# DataTable in plug-in for Javascript(ECMA5):
 
-   DataTable is a simple library for creating table dom immediately by setting config.

# Installing DataTables
  To use DataTable, the basic way is put the js and css file of DataTable.js on html head tag.
  <pre>
  &lt;head&gt;
    &lt;link rel="stylesheet" href="dataTable.css"&gt;
    &lt;script src="dataTable.js"/&gt;
  &lt;/head&gt;
  </pre>

# Usage
  In this simple case, DataTable will be initialised with following config.
  <pre>
    var dataTable = new DataTable({
      {
        id: 'dataTable',
        columns: [
          {
            isIndex: true,
            header: 'No.'
          },
          {
            header: 'Name',
            key: 'UserName'
          },
          {
            header: 'Age',
            key: 'Age'
          }
        ]
      }
    })

    dataTable.init(); // to initial the DataTable.
  </pre>

# Suitable for following Browsers
- Chrome
- IE11