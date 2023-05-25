import { useEffect, useState } from 'react';
import InventoryForm from './InventoryForm';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  Box,FormControl,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  Icon,
  SelectChangeEvent,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import AdjustStockDialog from './AdjustStock';
import { Toaster, toast } from 'react-hot-toast';
import WarningIcon from '@mui/icons-material/Warning';
import { InventoryItem } from '../utils/InventoryItemTypes';

interface CategoryOption {
  value: string;
  label: string;
}

const categories: CategoryOption[] = [
  { value: 'Pane', label: 'Pane' },
  { value: 'Inverter', label: 'Inverter' },
  { value: 'Wire', label: 'Wire' },
  { value: 'M4 Connector', label: 'M4 Connector' },
  { value: 'Others', label: 'Others' },
];

const InventoryPage: React.FC = () => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [rows, setRows] = useState<InventoryItem[]>([]);
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [showLowStock, setShowLowStock] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustStockOpen, setAdjustStockOpen] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);


  const onClose = () => setAdjustStockOpen(false);

  const handleOpenForm = () => {
    setItem(null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  const handleSaveInventory = async (item: InventoryItem) => {
    console.log(item);
    try {
      await axios.post('https://inventory-services.vercel.app/', item);
      toast.success('Item uploaded');
      getData();
      handleCloseForm();
    } catch (error) {
      console.log(error);
    }
  };

  

  async function getData() {
    try {
      const response = await axios.get('https://inventory-services.vercel.app/');
      setRows(response.data.items);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleAdjustStockOpen = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustStockOpen(true);
  };

  const handleEditInventory = (row: InventoryItem) => {
    setItem(row);
    setFormOpen(true);
  };

  const handleSaveEditedInventory = async (row: InventoryItem) => {
    try {
      const response = await axios.put(`https://inventory-services.vercel.app/${row._id}`, row);
      toast.success(response.data.message);
      getData();
      handleCloseForm();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteSelected = async () => {
    for (let i = 0; i < rowSelectionModel.length; i++) {
      try {
        await axios.delete(`https://inventory-services.vercel.app/${rowSelectionModel[i]}`);

        getData();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
    toast.success(`Deleted ${rowSelectionModel.length} item(s)`);
    getData()
  };

  const handleShowLowStock = () => {
    setShowLowStock(!showLowStock);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value);
  };



  const filteredRows = showLowStock
    ? rows.filter((row) => row.lowStockWarning && row.openingStock < row.lowStockUnits)
    : selectedCategory
      ? rows.filter((row) => row.category === selectedCategory)
      : rows;

      const columns: GridColDef[] = [
        { field: 'itemName', headerName: 'Item Name', width: 150 },
        { field: 'itemCode', headerName: 'Item Code', width: 150 },
        { field: 'category', headerName: 'Category', width: 150 },
        {
          field: 'openingStock',
          headerName: 'Stock Quantity',
          width: 150,
          renderCell: (params: GridRenderCellParams) => (
            <div>
              <span>{params.value}</span>
              <span> {params.row.unit}</span>
            </div>
          ),
        },
       
        {
          field: 'lowStockUnits',
          headerName: 'Stock On Hold',
          width: 130,
          renderCell: (params: GridRenderCellParams) => (
            <div>
              <span>{params.value}</span>
              <span> {params.row.unit}</span>
            </div>
          ),
        },
        {
          field: 'stockValue',
          headerName: 'Stock Value',
          width: 130,
          renderCell: (params: GridRenderCellParams) => (
            <span>₹{params.row.inclusiveOfTax ? params.row.purchasePrice*params.row.openingStock : Math.round( params.row.purchasePrice * (100.0 + params.row.gstTaxRate) / 100.0)*params.row.openingStock}</span>
          )
        },
        {
          field: 'purchasePrice',
          headerName: 'Purchase Price',
          width: 130,
          renderCell: (params: GridRenderCellParams) => (
            <span>₹{params.row.inclusiveOfTax ? params.row.purchasePrice : Math.round( params.row.purchasePrice * (100.0 + params.row.gstTaxRate) / 100.0)}</span>
          )
        },
        
        {
          field: 'lowstock',
          headerName: '',
          renderCell: (params: GridRenderCellParams) => (
            <strong>
              {params.row.lowStockWarning && params.row.openingStock < params.row.lowStockUnits ? (
                <Tooltip title="Low Stock Warning">
                  <Icon>
                    <WarningIcon sx={{ color: 'red' }} />
                  </Icon>
                </Tooltip>
              ) : null}
            </strong>
          ),
          width: 30,
        },
        {
          field: 'action',
          headerName: '',
          renderCell: (params: GridRenderCellParams) => (
            <strong>
              <Button onClick={() => handleEditInventory(params.row)}>
                <EditIcon/>
              </Button>
              <Button
                variant="outlined"
                size="small"
                tabIndex={params.hasFocus ? 0 : -1}
                onClick={() => handleAdjustStockOpen(params.row)}
              >
                Adjust Stock
              </Button>
            </strong>
          ),
          width: 210,
        },
      ];
      

  return (
    <div>
      <div>
        <Toaster />
      </div>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
      <Button variant="outlined" onClick={handleShowLowStock} style={{ margin: '1rem' }}>
          {showLowStock ? 'Hide Low Stock' : 'Show Low Stock'}
        </Button>

        <FormControl variant='standard'  size='small'  style={{minWidth: "150px", marginBottom: "1em"}}>
          <InputLabel>Category</InputLabel>
          <Select value={selectedCategory} onChange={handleCategoryChange}>
            <MenuItem value="">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" style={{ margin: '1rem' }} onClick={handleOpenForm}>
          Add Inventory
        </Button>

       
        <Button
          variant="contained"
          disabled={rowSelectionModel.length === 0}
          onClick={handleDeleteSelected}
          style={{ marginLeft: '1rem' }}
        >
          Delete Selected
        </Button>

        
        
      </div>
      <InventoryForm
        open={isFormOpen}
        item={item}
        onClose={handleCloseForm}
        onSave={handleSaveInventory}
        handleSaveEditedInventory={handleSaveEditedInventory}
      />
      <AdjustStockDialog open={adjustStockOpen} getData={getData} item={selectedItem} onClose={onClose} />

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          checkboxSelection
          disableRowSelectionOnClick
          getRowId={(row) => row._id}
          rows={filteredRows}
          columns={columns}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
        />
      </Box>
    </div>
  );
};

export default InventoryPage;
