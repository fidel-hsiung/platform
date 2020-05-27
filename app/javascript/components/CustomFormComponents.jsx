import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
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
        <Form.Control type='text' name={props.name} placeholder={props.placeholder} value={props.value} onChange={e => props.handleChange(e)} isInvalid={props.error} />
        <Form.Control.Feedback type='invalid'>{props.error}</Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
}

export function FormSelect (props) {

  return(
    <Form.Group as={Row}>
      <Form.Label column sm='3'>{props.label}</Form.Label>
      <Col sm='9'>
        <Select
          value={props.options.find(e=>e.value == props.value)}
          options={props.options}
          onChange={e => props.handleChange(e, props.name)}
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