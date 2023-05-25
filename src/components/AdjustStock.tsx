import { Button, Dialog, DialogActions,InputAdornment, DialogContent, DialogTitle, Typography, TextField, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { InventoryItem } from '../utils/InventoryItemTypes';



interface AdjustStockDialogProps {
  open: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  getData: () => void;
}

const AdjustStockDialog: React.FC<AdjustStockDialogProps> = ({
  open,
  item,
  onClose,getData
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>('add');

  const handleAdjustStock = async () => {
    const updatedStock: number | "" = item ? (selectedOption === 'remove' ? item.openingStock - quantity : item.openingStock + quantity) : '';
  
    if (parseInt(updatedStock as string) < 0) {
      toast.error('Invalid');
    }
  
    if (parseInt(updatedStock as string) >= 0) {
      try {
        await axios
          .put(`https://inventory-services.vercel.app/${item?._id}`, { openingStock: String(updatedStock) })
          .then((res) =>
            setTimeout(() => {
              toast.success(res.data.message);
              onClose();
              getData();
              setQuantity(0);
            }, 400)
          );
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };
  
  
  

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Adjust Stock</DialogTitle>
        <DialogContent style={{display:"flex",gap:'1rem',flexDirection:'column'}}>
          <Typography variant="subtitle1"> <span style={{ fontWeight: 'bold' }}>Item Name:</span> {item?.itemName}</Typography>
          <Typography variant="subtitle1"> <span style={{ fontWeight: 'bold' }}>Current Stock:</span> {item?.openingStock}</Typography>
          <FormControl style={{display:"flex"}}>
            <RadioGroup
              value={selectedOption} style={{display:'flex',flexDirection:'row'}}
              onChange={(e) => setSelectedOption(e.target.value)}
              name="radio-buttons-group"
            >
              <FormControlLabel value="add" control={<Radio />} label="(+) Add Stock" />
              <FormControlLabel value="remove" control={<Radio />} label="(-) Remove Stock" />
            </RadioGroup>
          </FormControl>
          <TextField
  label="Quantity"
  type="number" 
   InputProps={{
    endAdornment: <InputAdornment position="end">{item ?item.unit :''}</InputAdornment>
  }}
  value={quantity.toString()}
  onChange={(e) => setQuantity(Number(e.target.value))}
  fullWidth
/>
          <Typography variant="subtitle1" >
 <span style={{ fontWeight: 'bold' }}>Final Stock:</span>  {item ? (selectedOption === 'remove' ? item.openingStock - quantity : item.openingStock + quantity) : ''}
</Typography>
        </DialogContent>
        


        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdjustStock} variant="contained" color="primary">
            Adjust
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdjustStockDialog;
