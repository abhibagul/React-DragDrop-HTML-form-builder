import { useRef, useState } from 'react';
import './App.css';
import Parser from 'html-react-parser';
import $ from "jquery";
import { Popover, OverlayTrigger, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function App() {

  library.add(faTrash);

  const [elems, setElems] = useState([]);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const dragPosition = useRef(0);

  const arrangeElem = () => {
    if($('#element-option').length > 0)$('#element-option').html('');
    $('.highlighted').removeClass('.highlighted');

    console.log(dragPosition.current, 'dp');


    if (dragPosition.current > 0) {
      //duplicate element
      let _elems = [...elems];

      //remove and save the dragged element content
      const draggedItemCotent = _elems.splice(dragItem.current, 1)[0];

      //switch position
      _elems.splice(dragOverItem.current, 0, draggedItemCotent);

      //reset 
      dragItem.current = null;
      dragOverItem.current = null;

      //update
      setElems(_elems);
    } else if (dragPosition.current < 0) {
      //remove it!
      //duplicate element
      let _elems = [...elems];

      //remove and save the dragged element content
      _elems.splice(dragItem.current, 1);

      //reset 
      dragItem.current = null;
      dragOverItem.current = null;

      //update
      setElems(_elems);
    }
  }


  const handleAdding = (e) => {
    console.log('adding started');
  }

  const addDragElem = (e) => {
    if($('#element-option').length > 0)$('#element-option').html('');
    if ($(e.target).closest('.indragitem').hasClass("highlighted")) $('.highlighted').closest('.indragitem').removeClass('.highlighted')

    if (dragPosition.current > 0) {
      let _elems = [...elems];
      _elems.splice(dragOverItem.current, 0, e.target.innerHTML);
      dragItem.current = null;
      dragOverItem.current = null;
      setElems(_elems);
    }
  }

  const DragOverEl = (e, i) => {
    if (!$(e.target).closest('.indragitem').hasClass("highlighted")) $(e.target).closest('.indragitem').addClass('highlighted');
    dragOverItem.current = i;
  }

  const DragLeaveEl = (e, i) => {
    if ($(e.target).closest('.indragitem').hasClass("highlighted")) $(e.target).closest('.indragitem').removeClass('highlighted');

  }



  const handleChange = (e) => {
    // TODO
    console.log('change req');

    

    let _elems = [...elems];

    //index
    let i = $(e.target).attr('data-index');
    // let el = $(_elems[i]);
    // if(el.length < 2){
      let el = $('<div/>').append(_elems[i]);
    // }
    console.log(el,'elb')
    $('.option-wrapper-inner').map(function(){
      // console.log($(this).html(), $(this).find('.contenttxt').val(),el.html()); 
      let elsep = $(this).attr('data-element')

      //should we go with the element or remove it?
      if(!$(this).find('.headerelem input').is(":checked")){

        //remove this element
        el.find(elsep).remove();
      }else{

        //set attribs
        $(this).find('.attrib-options .row').map(function(){
          console.log('attr',$(this).find('.col-sm-4').text(), ' v:',$(this).find('.dynamicInput').val())
           el.find(elsep).attr($(this).find('.col-sm-4').text(),$(this).find('.dynamicInput').val())
        });

        //last steps
        //sizes
        if($(this).find('select').length > 0){
          //class
          if(el.find(elsep).hasClass('form-control'))el.find(elsep).removeClass('form-control');
          if(el.find(elsep).hasClass('form-control-sm'))el.find(elsep).removeClass('form-control-sm');
          if(el.find(elsep).hasClass('form-control-lg'))el.find(elsep).removeClass('form-control-lg');
          el.find(elsep).attr('class',$(this).find('select').val())
        }

        //content
        if($(this).find('.contenttxt').length > 0){
          
          el.find(elsep).html($(this).find('.contenttxt').val())
        }
      }

    });

    // console.log(el.html(),'ela');
    _elems.splice(i,1,el.html()); //lets try if it works?

    //update
    setElems(_elems);

    //close the box
    if($('#element-option').length > 0)$('#element-option').html('');
  }

  const removeSelector = (e) =>{
    // console.log('remove el', $(e.target).closest('button').attr('data-index'));
      if($('#element-option').length > 0)$('#element-option').html('');
      let _elems = [...elems];

      //remove and save the dragged element content
      _elems.splice($(e.target).closest('button').attr('data-index'), 1);

      //reset 
      dragItem.current = null;
      dragOverItem.current = null;

      //update
      setElems(_elems);

  }


  const popoverLeft = (
    <Popover id="element-option" title="Popover right">
      <div className='eloption'>
        <div className='option_input'>demo content</div>
        <div className='row pt-2 pb-2 border bg-light bottombar'>
          <div className='col-sm-6'>
          <div className='row '>
            <div className='col-sm-8'>
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Required : </label>
            </div>
            <div className='col-sm-4'>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
              </div>
            </div>
          </div>
          </div>
          <div className='col-sm-6 align-right'>
            <button onClick={handleChange} className="btn btn-primary btn-sm mr-2 appl">Apply</button>
            <button onClick={removeSelector} className="btn btn-danger btn-sm ml-2 rele"><FontAwesomeIcon icon="trash" /></button>
          </div>
        </div>
      </div>
    </Popover>
  );

  const handleDetails = (e, i) => {

    if($('.highlighted').length > 0){
      $('.highlighted').each(function(){
        $(this).removeClass('highlighted');
      })
    }
    if(!$(e.target).hasClass('highlighted'))$(e.target).addClass('highlighted');
   
    let outer = $('<div class="option-wrapper"></div>');

    
    //lets try to show the popover



    let $e = $(e.target).closest('.indragitem');
    //create the elemental form
    $($e).children().each(function () {

      let htm = $('<div class="option-wrapper-inner" data-element="'+ this.nodeName.toLowerCase() +'"></div>');

      let headerelem = $('<div class="headerelem"/>')
      let nonattrib = $('<div class="nonattrib"/>')
      //text
      if( !(this.nodeName.toLowerCase() == "input" || this.nodeName.toLowerCase() == "textarea")){
        headerelem.append('<div class="row optionrow"><div class="col-md-1"><div className="form-check form-switch"><input className="form-check-input switchelem" type="checkbox" checked role="switch" /></div></div><div class="col-md-10"><h6><span class="badge bg-secondary">'+ this.nodeName + '</span></h6></div></div>');
        nonattrib.append('<div class="row optionrow"><div class="col-sm-4 text-right">content : </div><div class="col-sm-8"><input class="form-control form-control-sm dynamicInput contenttxt" type="text" value="' + $(this).html() + '"></div></div>')
      }else{
        
        headerelem.append('<div class="row optionrow"><div class="col-md-1"><div className="form-check form-switch"><input className="form-check-input switchelem" type="checkbox" checked role="switch" disabled /></div></div><div class="col-md-10"><h6><span class="badge bg-secondary">'+ this.nodeName + '</span></h6></div></div>');
        if(this.nodeName.toLowerCase() == "input"){
          //input size
          let sel1,sel2,sel3 = "";
          if($(this).hasClass('form-control-sm')) sel1= "selected";
          else if($(this).hasClass('form-control-lg')) sel2= "selected";
          else sel3 = "selected";
          let input_selector = '<select class="form-select  form-select-sm" aria-label="Default select example">\
          <option value="form-control form-control-sm"'+ sel1 +'>Small</option>\
          <option value="form-control"'+ sel3 +'>Regular</option>\
          <option value="form-control form-control-lg"'+ sel2 +'>Large</option>\
        </select>';
          nonattrib.append('<div class="row optionrow"><div class="col-sm-4 text-right">content : </div><div class="col-sm-8">' + input_selector + '</div></div>');
        }
      }
      htm.append(headerelem);
      htm.append(nonattrib);

      let ham = $('<div class="attrib-options"></div>');
      //attribs
      $.each(this.attributes, function () {
        // this.attributes is not a plain object, but an array
        // of attribute nodes, which contain both the name and value
        if (this.specified) {
          // console.log(this.name, this.value);
          ham.append('<div class="row optionrow"><div class="col-sm-4 text-right the_prop">' + this.name + '</div><div class="col-sm-8"><input class="form-control form-control-sm dynamicInput" type="text" value="' + this.value + '"></div></div>')
        }
      });
        
        htm.append(ham);
        htm.append('<hr/>')
     
        outer.append(htm);
      })
    

    setTimeout(function(){
      $('.option_input, .rele, .appl').attr('data-index',i);
      $('.option_input').map(function () {
        $(this).html(outer);
      })
    },200)
    
  }




  return (
    <div className="container">
      <div className='row'>

        <div className='col-md-6 col-sm-6 inputs-option'>

          <div className='dragnoeffect' onDragEnter={(e) => dragPosition.current = 0}>
            <div
              className='input-text-add dragdropper'
              draggable="true"
              onDragStart={handleAdding}
              onDragEnd={addDragElem}>
              <label htmlFor='exampleEmailInput' className="form-label">Email address</label>
              <input type="email" id='exampleEmailInput' className="form-control " aria-describedby="emailHelp" placeholder='' />
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>


            <div
              className='input-text-add dragdropper'
              draggable="true"
              onDragStart={handleAdding}
              onDragEnd={addDragElem}>
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" className="form-control" aria-describedby="passwordHelp" id="exampleInputPassword1" />
              <div id="passwordHelp" className="form-text">Should be at least 8 charachters.</div>
            </div>

            <div
              className='input-text-add dragdropper'
              draggable="true"
              onDragStart={handleAdding}
              onDragEnd={addDragElem}>
              <h1>HTML Form h1</h1>
            </div>

            <div
              className='input-text-add dragdropper'
              draggable="true"
              onDragStart={handleAdding}
              onDragEnd={addDragElem}>
              <h2>HTML Form h2</h2>
            </div>

            <div
              className='input-text-add dragdropper'
              draggable="true"
              onDragStart={handleAdding}
              onDragEnd={addDragElem}>
              <h3>HTML Form h3</h3>
            </div>

            <div
              className='input-text-add dragdropper'
              draggable="true"
              onDragStart={handleAdding}
              onDragEnd={addDragElem}>
              <h4>HTML Form h4</h4>
            </div>
            <div
              className='input-text-add dragdropper'
              draggable="true"
              onDragStart={handleAdding}
              onDragEnd={addDragElem}>
              <h5>HTML Form h5</h5>
            </div>
            <div
              className='input-text-add dragdropper'
              draggable="true"
              onDragStart={handleAdding}
              onDragEnd={addDragElem}>
              <h6>HTML Form h6</h6>
            </div>


          </div>


          <div
            className='dustbin'
            onDragEnter={(e) => {
              dragPosition.current = -1;
              if (!$(e.target).hasClass('dustact')) $(e.target).addClass('dustact')
              $(e.target).text("Drop it.. i am hungry...");
            }}
            onDragLeave={(e) => { if ($(e.target).hasClass('dustact')) $(e.target).removeClass('dustact'); $(e.target).text("throw into the trash!") }}

          >
            throw into the trash!
          </div>

        </div>
        <div className='col-md-6 col-sm-6 output_form' onDragEnter={(e) => dragPosition.current = 1}>
          {(elems.length < 1) && <div
            className='empty'
            onDragEnter={(e) => { if (!$(e.target).hasClass('hover')) $(e.target).addClass('hover') }}
            onDragLeave={(e) => { if ($(e.target).hasClass('hover')) $(e.target).removeClass('hover') }}
          >
            Add elements to your form</div>}
          {

            elems && elems.map(function (e, i) {
              return (
                <OverlayTrigger
                  container={this}
                  trigger="click"
                  rootClose
                  placement="left"
                  overlay={popoverLeft}
                  key={i}
                >
                  <div
                    className="input_elem indragitem"
                    draggable="true"
                    onClick={(e) => handleDetails(e, i)}
                    onDragStart={(e) => dragItem.current = i}
                    onDragEnter={(e) => DragOverEl(e, i)}
                    onDragLeave={(e) => DragLeaveEl(e, i)}
                    onDragEnd={arrangeElem}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {Parser(e)}
                  </div>
                </OverlayTrigger>
              )
            })
          }
        </div>
        <div className='col-md-6 col-sm-6 HTMLCODE'>
          <textarea value={1}></textarea>
        </div>
      </div>

    </div>
  );
}

export default App;
