import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { closeModalBox } from 'actions/modalBoxActions';

export default function ModalBox(props) {

  const modalBox = useSelector(state => state.modalBox);
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <Modal show={modalBox.show} onHide={() => dispatch(closeModalBox())}>
        <Modal.Header closeButton>
          <Modal.Title>{modalBox.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBox.content}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => dispatch(closeModalBox())}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}