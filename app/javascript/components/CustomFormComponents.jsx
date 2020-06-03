import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Select from 'react-select';
import PlacesAutocomplete from 'react-places-autocomplete';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import ReactQuill from 'react-quill';

export function FormInput (props) {
  return(
    <Form.Group as={Row}>
      <Form.Label column sm='3'>{props.label}</Form.Label>
      <Col sm='9'>
        <Form.Control type='text' placeholder={props.placeholder} value={props.value} onChange={e => props.handleChange(e.target.value)} isInvalid={props.error} />
        <Form.Control.Feedback type='invalid'>{props.error}</Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
}

export function FormSelect (props) {

  let temp = props.options.find(e=>e.value == props.value);
  let value = temp ? temp : '';

  return(
    <Form.Group as={Row}>
      <Form.Label column sm='3'>{props.label}</Form.Label>
      <Col sm='9'>
        <Select
          value={value}
          options={props.options}
          onChange={e => props.handleChange(e ? e.value : '')}
          placeholder={props.placeholder}
          className="basic-multi-select"
          classNamePrefix="select"
        />
        <div className='error'>{props.error}</div>
      </Col>
    </Form.Group>
  );
}

export function FormAddress (props) {
  return(
    <Form.Group as={Row}>
      <Form.Label column sm='3'>{props.label}</Form.Label>
      <div className='col-sm-9'>
        <PlacesAutocomplete
          value={props.value}
          onChange={e=>props.handleChange(e, props.name)}
          onSelect={e=>props.handleChange(e, props.name)}
          searchOptions={ {componentRestrictions: {country: 'au'}, type: ['street_address']} }
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div className='input-with-autocomplete'>
              <input
                {...getInputProps({
                  placeholder: props.placeholder,
                  className: 'location-search-input form-control' + (props.error ? ' is-invalid' : ''),
                })}
                autoComplete="nope"
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div className='loading'>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#FFE7E7', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <p>{suggestion.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </PlacesAutocomplete>
        <div className='error'>{props.error}</div>
      </div>
    </Form.Group>
  );
}

export function FormDatePicker (props) {
  return(
    <Form.Group as={Row}>
      <Form.Label column sm='3'>{props.label}</Form.Label>
      <div className='col-sm-9'>
        <DatePicker selected={props.value == '' ? null : moment(props.value)._d} onChange={e => props.handleChange(e, props.name)} className={'form-control' + (props.error ? ' is-invalid' : '')} dateFormat="dd MMMM yyyy" placeholderText={props.placeholder} />
        <div className='error'>{props.error}</div>
      </div>
    </Form.Group>
  );
}

export function FormAttendeesSelect (props) {

  let temp = props.options.filter(option => {return props.value.indexOf(option.id) != -1})
  let value = temp ? temp : [];

  return(
    <Form.Group as={Row}>
      <Form.Label column sm='3'>{props.label}</Form.Label>
      <Col sm='9'>
        <Select
          value={value}
          options={props.options}
          isMulti
          getOptionLabel={(data)=>{return data.full_name;}}
          getOptionValue={(data)=>{return data.id}}
          onChange={e => props.handleChange(e)}
          placeholder={props.placeholder}
          className="basic-multi-select"
          classNamePrefix="select"
        />
        <div className='error'>{props.error}</div>
      </Col>
    </Form.Group>
  );
}

export function FormRichTextInput (props) {
  return(
    <Form.Group as={Row}>
      <Form.Label column sm='3'>{props.label}</Form.Label>
      <div className='col-sm-9'>
        <ReactQuill
          theme='snow'
          value={props.value}
          onChange={e=>props.handleChange(e, props.name)}
          placeholder={props.placeholder}
          className={props.error ? ' is-invalid' : ''}
        />
        <div className='error'>{props.error}</div>
      </div>
    </Form.Group>
  );
}

export function FilterFormMultiSelect (props) {

  let temp = props.options.filter(option => {return props.value.indexOf(option.value) != -1})
  let value = temp ? temp : [];

  return(
    <Form.Group as={Row}>
      <Form.Label column sm='3'>{props.label}</Form.Label>
      <Col sm='9'>
        <Select
          value={value}
          options={props.options}
          isMulti
          onChange={e=>props.handleChange(e ? e.map(temp=>temp.value) : [])}
          placeholder={props.placeholder}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </Col>
    </Form.Group>
  );
}

export function FilterFormDateRange (props) {

  let startDate = props.startDate == '' ? null : new Date(props.startDate);
  let endDate = props.endDate == '' ? null : new Date(props.endDate);

  return(
    <Form.Group as={Row}>
      <Form.Label column sm='3'>Date Range</Form.Label>
      <Col sm='9' className='d-flex justify-content-between'>
        <DatePicker selectsStart startDate={startDate} endDate={endDate} selected={startDate} onChange={e => props.handleStartDateChange(e == null ? '' : moment(e).format('YYYY-MM-DD'))} className='form-control' dateFormat="yyyy-MM-dd" placeholderText='start date' />
        <div className='d-flex flex-column justify-content-center'> to </div>
        <DatePicker selectsEnd startDate={startDate} endDate={endDate} selected={endDate} onChange={e => props.handleEndDateChange(e == null ? '' : moment(e).format('YYYY-MM-DD'))} className='form-control' dateFormat="yyyy-MM-dd" placeholderText='end date' minDate={startDate} />
      </Col>
    </Form.Group>
  );
}

export function FormImageUpload (props) {

  const [fileName, setFileName] = useState('');

  useEffect(()=>{
    if (props.image){
      setFileName(props.image.name);
    } else {
      setFileName('');
    }
    if (!!props.image) {
    }
  }, [props.image]);

  function handleUploadChange(e){
    let image = e.target.files[0]
    props.handleChange(image, props.name)
  }

  return(
    <div className='form-upload-input'>
      <label>
        <div className="btn btn-outline-dark">{props.buttonText}</div>
        <div className='hide'>
          <input
            type="file"
            accept="image/jpg, image/jpeg, image/png"
            onChange={e=>handleUploadChange(e)}
          />
        </div>
      </label>
      <u className='file-name'>
        {fileName}
      </u>
    </div>
  );
}