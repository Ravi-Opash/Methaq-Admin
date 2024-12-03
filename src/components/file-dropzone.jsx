// This is a modified version of react-dropzone

import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { Duplicate as DuplicateIcon } from "src/Icons/Duplicate";
import { X as XIcon } from "src/Icons/X";
import { bytesToSize } from "src/utils/bytes-to-size";
import UploadSvg from "src/Icons/UploadSvg";

export const FileDropzone = (props) => {
  const {
    // Own props
    files = [],
    onRemove,
    onRemoveAll,
    onUpload,
    size = "",
    // DropzoneOptions props
    accept,
    disabled,
    getFilesFromEvent,
    maxSize,
    minSize,
    multiple,
    maxFiles,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onDropAccepted,
    onDropRejected,
    onFileDialogCancel,
    onFileDialogOpen,
    useFsAccessApi,
    autoFocus,
    preventDropOnDocument,
    noClick,
    noKeyboard,
    noDrag,
    noDragEventsBubbling,
    onError,
    validator,
    ...other
  } = props;

  // We did not add the remaining props to avoid component complexity
  // but you can simply add it if you need to.
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    minSize,
    onDrop,
  });

  return (
    <div {...other}>
      <Box
        sx={{
          alignItems: "center",
          border: 1,
          borderRadius: 1,
          borderStyle: "dashed",
          borderColor: "divider",
          display: "flex",
          flexWrap: size == "small" ? "unset" : "wrap",
          justifyContent: "center",
          outline: "none",
          p: size == "small" ? 2 : 6,
          ...(isDragActive && {
            backgroundColor: "action.active",
            opacity: 0.5,
          }),
          "&:hover": {
            backgroundColor: "action.hover",
            cursor: "pointer",
            opacity: 0.5,
          },
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            width: size == "small" ? "50px" : "70px",
            height: size == "small" ? "50px" : "70px",
            background: "#e5e7eb",
            borderRadius: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UploadSvg />
        </Box>
        <Box sx={{ p: size == "small" ? 1 : 2 }}>
          <Typography variant="h6" sx={{ fontSize: size == "small" ? 16 : 20 }}>{`Select file${
            maxFiles && maxFiles === 1 ? "" : "s"
          }`}</Typography>
          <Box sx={{ mt: size == "small" ? 1 : 2 }}>
            <Typography variant="body1" sx={{ fontSize: size == "small" ? 15 : 16 }}>
              {`Drop file${maxFiles && maxFiles === 1 ? "" : "s"}`} <Link underline="always">browse</Link> thorough your
              machine
            </Typography>
          </Box>
        </Box>
      </Box>
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <List>
            {files.map((file) => (
              <ListItem
                key={file.path}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  "& + &": {
                    mt: 1,
                  },
                }}
              >
                <ListItemIcon>
                  <DuplicateIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  primaryTypographyProps={{
                    color: "textPrimary",
                    variant: "subtitle2",
                  }}
                  secondary={bytesToSize(file.size)}
                />
                <Tooltip title="Remove">
                  <IconButton edge="end" onClick={() => onRemove?.(file)}>
                    <XIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
            }}
          >
            <Button onClick={onRemoveAll} size="small" type="button">
              Remove All
            </Button>
            <Button onClick={onUpload} size="small" sx={{ ml: 2 }} type="button" variant="contained">
              Upload
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

FileDropzone.propTypes = {
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  onUpload: PropTypes.func,
  // @ts-ignore
  accept: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  disabled: PropTypes.bool,
  getFilesFromEvent: PropTypes.func,
  maxFiles: PropTypes.number,
  maxSize: PropTypes.number,
  minSize: PropTypes.number,
  noClick: PropTypes.bool,
  noDrag: PropTypes.bool,
  noDragEventsBubbling: PropTypes.bool,
  noKeyboard: PropTypes.bool,
  onDrop: PropTypes.func,
  onDropAccepted: PropTypes.func,
  onDropRejected: PropTypes.func,
  onFileDialogCancel: PropTypes.func,
  preventDropOnDocument: PropTypes.bool,
};
