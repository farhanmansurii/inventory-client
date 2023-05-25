import React from 'react'
import {TableContainer, Paper, TableHead, TableRow, TableBody, TableCell, Table, Checkbox  } from '@mui/material'

export default function Table1() {
  return (
    <TableContainer component={Paper}>
    <Table style={{minWidth: "992px"}}>
        <TableHead>
            <TableRow>
                <TableCell className="BoldCell">
                    
                </TableCell>
                <TableCell className="BoldCell">Item Name</TableCell>
                <TableCell className="BoldCell">Item Code</TableCell>
                <TableCell className="BoldCell">Category</TableCell>
                <TableCell className="BoldCell">Stock Quantity</TableCell>
                <TableCell className="BoldCell">Stock Value</TableCell>
                <TableCell className="BoldCell">Purchase Price</TableCell>
                <TableCell className="BoldCell"></TableCell>
            </TableRow>
        </TableHead>

        <TableBody>
           
        </TableBody>
    </Table>
</TableContainer>
  )
}
