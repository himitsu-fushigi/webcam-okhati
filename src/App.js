import { Avatar, Button } from "@material-ui/core";
import React from "react";
import styles from "./App.module.css";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function App() {
  const [userImage, setUserImage] = React.useState(null); // @dev image is stored

  const webcamRef = React.useRef(null);

  const captureUserImage = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setUserImage(imageSrc);
  }, [webcamRef]);

  const [userImageAnchor, setUserImageAnchor] = React.useState(null);

  const classes = useStyles();
  const [openCamera, setOpenCamera] = React.useState(false); // @dev this state is used to open camera for user image

  const handleOpenCamera = () => {
    setOpenCamera(true);
  };

  const handleCloseCamera = () => {
    setOpenCamera(false);
  };

  const handleUserImageClick = (event) => {
    setUserImageAnchor(event.currentTarget);
  };

  const handleUserImageClose = () => {
    setUserImageAnchor(null);
  };

  const handleUserImageUpload = (e) => {
    setUserImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <>
      <Button
        aria-controls="user-image-upload"
        aria-haspopup="true"
        onClick={handleUserImageClick}
      >
        <Avatar
          src={userImage && userImage}
          alt="User Icon"
        />
      </Button>

      {/* menu for user image upload */}
      <Menu
        id="user-image-upload"
        anchorEl={userImageAnchor}
        keepMounted
        open={Boolean(userImageAnchor)}
        onClose={handleUserImageClose}
      >
        {/* upload image */}
        <MenuItem onClick={handleUserImageClose}>
          <input
            type="file"
            onChange={handleUserImageUpload}
            className={styles.imageInput}
            id="actual-btn"
            hidden
          />
          {/* @dev using label as button to upload */}
          <label className={styles.userImageLabel} for="actual-btn">
            Upload Image
          </label>
        </MenuItem>

        {/* capture image */}
        <MenuItem
          onClick={() => {
            handleUserImageClose();
            handleOpenCamera();
          }}
        >
          Capture Image
        </MenuItem>
      </Menu>

      {/* @dev this is webcam */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openCamera}
        onClose={handleCloseCamera}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openCamera}>
          <div className={classes.paper}>
            <Webcam
              audio={false}
              height={720}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={1280}
              videoConstraints={videoConstraints}
            />
            <Button onClick={() => {
              captureUserImage()
              handleCloseCamera()
            }}>Capture photo</Button>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
