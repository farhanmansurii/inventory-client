import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  Divider,
  MenuItem,
  InputAdornment,
  Switch,
} from '@mui/material';
import ImageUploadComponent from './ImageUpload';




interface InventoryItem {
  id?: number;
  itemName: string;
  category: string;
  itemCode: string;
  itemDescription: string;
  unit: string;
  openingStock: number;
  asOfDate: string;
  lowStockWarning: boolean;
  lowStockUnits: number;
  purchasePrice: number;
  inclusiveOfTax: boolean;
  gstTaxRate: number;
  images: string[];
}

interface InventoryFormProps {
  open: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
  handleSaveEditedInventory: (row: InventoryItem) => Promise<void>;
}

const categories: string[] = [
  'Pane',
  'Inverter',
  'Wire',
  'M4 Connector',
  'Others'
];
const GST: number[] = [0, 0.1, 0.25, 3, 5, 10, 12, 15, 18];
const units = [
  { name: 'FEET(FT)', abbreviation: 'FT' },
  { name: 'INCHES(IN)', abbreviation: 'IN' },
  { name: 'UNITS(UNT)', abbreviation: 'UNT' },
  { name: 'PIECES(PCS)', abbreviation: 'PCS' },
  { name: 'NUMBERS(NOS)', abbreviation: 'NOS' },
  { name: 'MILLIMETERS(MM)', abbreviation: 'MM' },
  { name: 'CENTIMETERS(CMS)', abbreviation: 'CMS' },
  { name: 'METERS(MTR)', abbreviation: 'MTR' }
];

const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};



const InventoryForm: React.FC<InventoryFormProps> = ({
  open,
  item,
  onClose,
  onSave,
  handleSaveEditedInventory,
}) => {
  const initialState: InventoryItem = {
    itemName: '',
    category: '',
    itemCode: '',
    itemDescription: '',
    unit: '',
    openingStock: 0,
    asOfDate: getCurrentDate(),
    lowStockWarning: false,
    lowStockUnits: 0,
    purchasePrice: 0,
    inclusiveOfTax: false,
    gstTaxRate: 0,
    images: [],
  };

  const [formState, setFormState] = useState<InventoryItem>(initialState);

  useEffect(() => {
    if (item) {
      setFormState(item);
    } else {
      setFormState(initialState);
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === 'checkbox' ? checked : value;

    setFormState((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleLowStockWarningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      lowStockWarning: checked,
    }));
  };
  const handleImageRemove = (index: number) => {
    const updatedImages = formState.images.filter((_, i) => i !== index);
    setFormState((prevState) => ({
      ...prevState,
      images: updatedImages,
    }));
   
  };
  const handleSaveInventory = () => {
    if (item) {
      handleSaveEditedInventory(formState);
      console.log(formState)
    } else {
      onSave(formState); console.log(formState)
    }
  };

  const handleResetForm = () => {
    setFormState(initialState);
    onClose();
  };

  const handleImageUpload = (files: File[]) => {
    const fileURLs: string[] = [];
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append('file', file);
      formData.append('upload_preset', 'medtsm1p');
      formData.append('cloud_name', 'ecommerceupload');

      fetch('https://api.cloudinary.com/v1_1/ecommerceupload/image/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          fileURLs.push(data.secure_url);

          if (fileURLs.length === files.length) {
            setFormState((prevState) => ({
              ...prevState,
              images: [...formState.images,data.secure_url],
            }));
        
          }
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
        });
    }
  };

  return (
    <Dialog maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>{item ? 'Edit Inventory' : 'Add Inventory'}</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', height: 400, padding: '1rem' }}>
          <div style={{ flex: '0 0 50%', paddingRight: '1rem' }}>
            <Divider />
            <Typography variant="h6" style={{ margin: '0.5rem' }}>
              General Details
            </Typography>
            <Divider style={{ marginBottom: '1rem' }} />
            <div style={{ marginBottom: '1rem' }}>
              <Typography variant="subtitle2">Image Upload</Typography>
              <ImageUploadComponent
          handleImageUpload={handleImageUpload}
          handleImageRemove={handleImageRemove}
          images={formState.images}
        />
            </div>
            <TextField
              style={{ width: '100%', marginBottom: '1rem' }}
              label="Item Name"
              variant="outlined"
              name="itemName"
              value={formState.itemName}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Category"
              select
              style={{ width: '100%', marginBottom: '1rem' }}
              name="category"
              value={formState.category}
              onChange={handleChange}
              variant="outlined"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              style={{ width: '100%', marginBottom: '1rem' }}
              label="Item Code"
              variant="outlined"
              name="itemCode"
              value={formState.itemCode}
              onChange={handleChange}
            />
            <TextField
              style={{ width: '100%', marginBottom: '1rem' }}
              label="Item Description"
              multiline
              rows={4}
              variant="outlined"
              name="itemDescription"
              value={formState.itemDescription}
              onChange={handleChange}
            />
          </div>
          <Divider orientation="vertical" flexItem />
          <div style={{ flex: '0 0 50%', paddingLeft: '1rem' }}>
            <Divider />
            <Typography variant="h6" style={{ margin: '0.5rem' }}>
              Stock Details
            </Typography>
            <Divider style={{ marginBottom: '1rem' }} />
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <TextField
                style={{ width: '60%', marginBottom: '1rem' }}
                label="Unit"
                select
                variant="outlined"
                name="unit"
                value={formState.unit}
                onChange={handleChange}
              >
                {units.map((unit) => (
                  <MenuItem key={unit.name} value={unit.abbreviation}>
                    {unit.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                style={{ marginBottom: '1rem' }}
                label="Opening Stock"
                type="number"
                variant="outlined"
                name="openingStock"
                InputProps={{
                  endAdornment: <InputAdornment position="end">{formState.unit ? formState.unit : 'UNT'}</InputAdornment>,
                }}
                value={formState.openingStock}
                onChange={handleChange}
              />
            </div>
            <TextField
              style={{ marginBottom: '1rem', width: '80%' }}
              label="As of Date"
              type="date"
              name="asOfDate"
              value={formState.asOfDate}
              onChange={handleChange}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginBlock: '1rem' }}>
              <Switch
                checked={formState.lowStockWarning}
                onChange={handleLowStockWarningChange}
                name="lowStockWarning"
              />
              <Typography style={{ marginLeft: '0.5rem' }}>Enable Low Stock Warning</Typography>
            </div>
            {formState.lowStockWarning && (
              <TextField
                style={{ width: '100%', marginBottom: '1rem' }}
                label="Low Stock Units"
                type="number"
                variant="outlined"
                InputProps={{
                  endAdornment: <InputAdornment position="end">{formState.unit ? formState.unit : 'UNT'}</InputAdornment>,
                }}
                name="lowStockUnits"
                value={formState.lowStockUnits}
                onChange={handleChange}
              />
            )}
            <Divider />
            <Typography variant="h6" style={{ margin: '0.5rem' }}>
              Pricing Details
            </Typography>
            <Divider style={{ marginBottom: '1rem' }} />
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <TextField
                style={{ width: '60%', marginBottom: '1rem' }}
                label="Unit Price"
                type="number"
                variant="outlined"
                name="purchasePrice"
                InputProps={{
                  endAdornment: <InputAdornment position="end">&#8377;</InputAdornment>,
                }}
                value={formState.purchasePrice}
                onChange={handleChange}
              />
              <Switch
                checked={formState.inclusiveOfTax}
                onChange={handleChange}
                name="inclusiveOfTax"
              />
              <Typography style={{ marginLeft: '0.5rem' }}>Inclusive of Tax</Typography>
            </div>
              <TextField
                style={{ width: '100%', marginBottom: '1rem' }}
                label="GST Tax Rate"
                select
                variant="outlined"
                name="gstTaxRate"
                value={formState.gstTaxRate}
                onChange={handleChange}
              >
                {GST.map((taxRate) => (
                  <MenuItem key={taxRate} value={taxRate}>
                    {taxRate}%
                  </MenuItem>
                ))}
              </TextField>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleResetForm} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSaveInventory} color="primary">
          {item ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryForm;
