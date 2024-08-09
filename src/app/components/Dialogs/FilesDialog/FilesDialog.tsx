import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItemText,
  ListItemIcon,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import { IFile } from '@/models/Location';
import ListItemButton from '@mui/material/ListItemButton';

export interface FilesDialogProps {
  files?: IFile[];
  handleClose: () => void;
  isOpen: boolean;
}

const FilesDialog = ({ isOpen, handleClose, files }: FilesDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      fullScreen={fullScreen}
      maxWidth="sm"
      scroll="paper"
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        Uploaded Files
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {files && files.length > 0 ? (
          <List>
            {files.map(({ url, name }, index) => (
              <ListItemButton component="a" href={url} target="_blank" rel="noopener noreferrer" key={index}>
                <ListItemIcon>
                  <LinkIcon />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary" align="center">
            No files uploaded.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FilesDialog;
