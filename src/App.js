import { useRef, useState } from 'react';
import './App.css';
import Parser from 'html-react-parser';
import $ from "jquery";
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import Nav from './nav';
function App() {

  library.add(faTrash);

  const [elems, setElems] = useState([]);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const dragPosition = useRef(0);

  const arrangeElem = () => {
    if ($('#element-option').length > 0) $('#element-option').html('');
    $('.highlighted').removeClass('.highlighted');

    //console.log(dragPosition.current, 'dp');


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
    //console.log('adding started');
  }

  const addDragElem = (e) => {
    if ($('#element-option').length > 0) $('#element-option').html('');
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
    //console.log('change req');



    let _elems = [...elems];

    //index
    let i = $(e.target).attr('data-index');
    // let el = $(_elems[i]);
    // if(el.length < 2){
    let el = $('<div/>').append(_elems[i]);
    // }
    //console.log(el, 'elb')
    $('.option-wrapper-inner').map(function () {
      // //console.log($(this).html(), $(this).find('.contenttxt').val(),el.html()); 
      let elsep = $(this).attr('data-element');
      //console.log('======================');
      //console.log('===== ' + elsep + ' =======');
      //console.log('======================');


      //should we go with the element or remove it?
      if (!$(this).find('.headerelem input').is(":checked")) {

        //remove this element
        el.find(elsep).remove();
      } else {

        //set attribs
        $(this).find('.attrib-options .row').map(function () {
          ////console.log('attr: ', $(this).find('.col-sm-4').text(), ' v:', $(this).find('.dynamicInput').val())
          el.find(elsep).attr($(this).find('.col-sm-4').text(), $(this).find('.dynamicInput').val())
        });

        //required
        if ($(this).find('.isReq').length > 0) {
          //class
          if ($(this).find('.isReq').is(":checked")) {
            //add required attrib
            el.find(elsep).attr('required', 'required');
          } else {
            //remove required attr
            el.find(elsep).removeAttr('required')
          }
        }


        //disabled
        if ($(this).find('.isDsc').length > 0) {
          //class
          if ($(this).find('.isDsc').is(":checked")) {
            //add required attrib
            el.find(elsep).attr('disabled', 'disabled');
          } else {
            //remove required attr
            el.find(elsep).removeAttr('disabled')
          }
        }

        //checked
        // if ($(this).find('.isCsc').length > 0) {
        //   //class
        //   if ($(this).find('.isCsc').is(":checked")) {
        //     //add required attrib
        //     //console.log(el.find(elsep).attr('checked'),'before')
        //     el.find(elsep).attr('checked', 'checked');
        //     //console.log(el.find(elsep).attr('checked'),'after')
        //   } else {
        //     //console.log('change req to disable checkbox')
        //     //remove required attr
        //     //console.log(el.find(elsep).attr('checked'),'before')
        //     el.find(elsep).removeAttr('checked');
        //     //console.log(el.find(elsep).attr('checked'),'after')
        //   }
        // }

        //readonly
        if ($(this).find('.isRsc').length > 0) {
          //class
          if ($(this).find('.isRsc').is(":checked")) {
            //add required attrib
            el.find(elsep).attr('readonly', 'readonly');
          } else {
            //remove required attr
            el.find(elsep).removeAttr('readonly')
          }
        }


        //sizes
        if ($(this).find('select').length > 0) {


          let svl = el.find(elsep)

          //class
          if (el.find(elsep).hasClass('form-control')) el.find(elsep).removeClass('form-control');
          if (el.find(elsep).hasClass('form-control-sm')) el.find(elsep).removeClass('form-control-sm');
          if (el.find(elsep).hasClass('form-control-lg')) el.find(elsep).removeClass('form-control-lg');

          svl.addClass($(this).find('select').val());

          //console.log(el.find(elsep));
        }

        //content
        if ($(this).find('.contenttxt').length > 0) {
          el.find(elsep).html($(this).find('.contenttxt').val())
        }
      }

    });

    // //console.log(el.html(),'ela');
    _elems.splice(i, 1, el.html()); //lets try if it works?

    //update
    setElems(_elems);

    //close the box
    if ($('#element-option').length > 0) $('#element-option').html('');
  }

  const removeSelector = (e) => {
    // //console.log('remove el', $(e.target).closest('button').attr('data-index'));
    if ($('#element-option').length > 0) $('#element-option').html('');
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
                {/* <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Required : </label> */}
              </div>
              <div className='col-sm-4'>
                <div className="form-check form-switch">
                  {/* <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" /> */}
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

    if ($('.highlighted').length > 0) {
      $('.highlighted').each(function () {
        $(this).removeClass('highlighted');
      })
    }
    if (!$(e.target).hasClass('highlighted')) $(e.target).closest('.indragitem').addClass('highlighted');

    let outer = $('<div class="option-wrapper"></div>');


    //lets try to show the popover
    let $e;

    if ($(e.target).closest('.indragitem').find('.input-group').length > 0) {
      $e = $(e.target).closest('.indragitem').find('.input-group');
    } else if ($(e.target).closest('.indragitem').find('.form-floating').length > 0) {
      $e = $(e.target).closest('.indragitem').find('.form-floating');
    } else {
      $e = $(e.target).closest('.indragitem');
    }



    //create the elemental form
    $($e).children().each(function () {

      //console.log('item', this);

      // if($(this).hasClass('input-group-text')){
      //   this = $(this).find('input-group-text');
      // }else{
      //   this =
      // }

      //get class list
      if ($(this).hasClass('highlighed')) $(this).removeClass('highlighed');
      let cls = '';
      if ($(this).attr('class')) cls = $(this).attr('class').split(/\s+/);

      if (cls.length > 0) {
        cls = cls.join('.');
        cls = '.' + cls;
        if (cls[cls.length - 1] === ".") cls = cls.slice(0, -1);
      } else {
        cls = '';
      }


      let htm = $('<div class="option-wrapper-inner" data-element="' + this.nodeName.toLowerCase() + '' + cls + '"></div>');

      let headerelem = $('<div class="headerelem"/>')
      let nonattrib = $('<div class="nonattrib"/>')
      //text
      if (!(this.nodeName.toLowerCase() == "input" || this.nodeName.toLowerCase() == "textarea")) {
        headerelem.append('<div class="row optionrow"><div class="col-md-1"><div className="form-check form-switch"><input className="form-check-input switchelem" type="checkbox" checked role="switch" /></div></div><div class="col-md-10"><h6><span class="badge bg-secondary">' + this.nodeName + '</span></h6></div></div>');
        nonattrib.append('<div class="row optionrow"><div class="col-sm-4 text-right">content : </div><div class="col-sm-8"><input class="form-control form-control-sm dynamicInput contenttxt" type="text" value="' + $(this).html() + '"></div></div>')
      } else {

        headerelem.append('<div class="row optionrow"><div class="col-md-1"><div className="form-check form-switch"><input className="form-check-input switchelem" type="checkbox" checked role="switch" disabled /></div></div><div class="col-md-10"><h6><span class="badge bg-secondary">' + this.nodeName + '</span></h6></div></div>');
        if (this.nodeName.toLowerCase() == "input") {

          let t = $(this).attr('type');

          //last steps
          if (!(t == 'color' || t == 'checkbox' || t == 'radio' || t == 'range')) {


            //input size
            let sel1, sel2, sel3 = "";
            if ($(this).hasClass('form-control-sm')) sel1 = "selected";
            else if ($(this).hasClass('form-control-lg')) sel2 = "selected";
            else sel3 = "selected";
            let input_selector = '<select class="form-select  form-select-sm" aria-label="Default select example"><option value="form-control form-control-sm"' + sel1 + '>Small</option><option value="form-control"' + sel3 + '>Regular</option><option value="form-control form-control-lg"' + sel2 + '>Large</option></select>';
            nonattrib.append('<div class="row optionrow"><div class="col-sm-4 text-right">content : </div><div class="col-sm-8">' + input_selector + '</div></div>');

            //readonly
            let rch = '';
            if ($(this).attr('readonly')) rch = 'checked';

            nonattrib.append('<div class="row optionrow"><div class="col-sm-4 text-right">Readonly : </div><div class="col-sm-8"><input class="form-check-input isRsc" type="checkbox"  ' + rch + '></div></div>');



          }

          //checked
          //TODO : unanle to remove checked afterwards!
          // if(t == 'checkbox' || t == 'radio'){
          //   let cchh = '';
          //   if ($(this).attr('checked')) cchh = 'checked';

          //   nonattrib.append('<div class="row optionrow"><div class="col-sm-4 text-right">Checked : </div><div class="col-sm-8"><input class="form-check-input isCsc" type="checkbox"  ' + cchh + '></div></div>');
          // }

          //reuired 
          let ch = '';
          if ($(this).attr('required')) ch = 'checked';

          nonattrib.append('<div class="row optionrow"><div class="col-sm-4 text-right">Required : </div><div class="col-sm-8"><input class="form-check-input isReq" type="checkbox"  ' + ch + '></div></div>');

          //disabled
          let dch = '';
          if ($(this).attr('disabled')) dch = 'checked';

          nonattrib.append('<div class="row optionrow"><div class="col-sm-4 text-right">Disabled : </div><div class="col-sm-8"><input class="form-check-input isDsc" type="checkbox"  ' + dch + '></div></div>');


        }
        if (this.nodeName.toLowerCase() == "textarea") {
          //reqd
          let chh = '';
          if ($(this).attr('required')) chh = 'checked';

          nonattrib.append('<div class="row optionrow"><div class="col-sm-4 text-right">Required : </div><div class="col-sm-8"><input class="form-check-input isReq" type="checkbox"  ' + chh + '></div></div>');

          //disabled
          let dch = '';
          if ($(this).attr('disabled')) dch = 'checked';

          nonattrib.append('<div class="row optionrow"><div class="col-sm-4 text-right">Disabled : </div><div class="col-sm-8"><input class="form-check-input isDsc" type="checkbox"  ' + dch + '></div></div>');

          //readonly
          let rch = '';
          if ($(this).attr('readonly')) rch = 'checked';

          nonattrib.append('<div class="row optionrow"><div class="col-sm-4 text-right">Readonly : </div><div class="col-sm-8"><input class="form-check-input isRsc" type="checkbox"  ' + rch + '></div></div>');
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
          // //console.log(this.name, this.value);
          if (this.name != 'checked') {
            ham.append('<div class="row optionrow"><div class="col-sm-4 text-right the_prop">' + this.name + '</div><div class="col-sm-8"><input class="form-control form-control-sm dynamicInput" type="text" value="' + this.value + '"></div></div>')

          }
        }
      });

      htm.append(ham);
      htm.append('<hr/>')

      outer.append(htm);
    })


    setTimeout(function () {
      $('.option_input, .rele, .appl').attr('data-index', i);
      $('.option_input').map(function () {
        $(this).html(outer);
      })
    }, 200)

  }

  function process(str) {

    var div = document.createElement('div');
    div.innerHTML = str.trim();

    return format(div, 0).innerHTML;
  }

  function format(node, level) {

    var indentBefore = new Array(level++ + 1).join('  '),
      indentAfter = new Array(level - 1).join('  '),
      textNode;

    for (var i = 0; i < node.children.length; i++) {

      textNode = document.createTextNode('\n' + indentBefore);
      node.insertBefore(textNode, node.children[i]);

      format(node.children[i], level);

      if (node.lastElementChild == node.children[i]) {
        textNode = document.createTextNode('\n' + indentAfter);
        node.appendChild(textNode);
      }
    }

    return node;
  }

  const genHtml = (elem) => {
    let _elems = [...elem];
    _elems = _elems.map(function (a) {
      return '<div class="form-group">' + a + '</div>'
    })
    return process(_elems.join(' \n'));
  }

  // const [htmlelems, setHtmlElems] = useState([]);

  let inputelems = ['<label for=\'exampleEmailInput\' class="form-label">Email address</label><input type="email" id=\'exampleEmailInput\' value="" class="form-control" aria-describedby="emailHelp" placeholder=\'\' /><div id="emailHelp" class="form-text">We\'ll never share your email with anyone else.</div>', '<label for="exampleInputPassword1" class="form-label">Password</label><input type="password" value="" class="form-control" aria-describedby="passwordHelp" id="exampleInputPassword1" /><div id="passwordHelp" class="form-text">Should be at least 8 charachters.</div>', '<label for="exampleFormControlTextarea1" class="form-label">Example textarea</label><textarea value=" " class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>']


  let headeerlems = ['<h1>HTML Form h1</h1>', '<h2>HTML Form h2</h2>', '<h3>HTML Form h3</h3>', '<h4>HTML Form h4</h4>', '<h5>HTML Form h5</h5>', '<h6>HTML Form h6</h6>', '<label>My Label</label>'];

  let checboxandradio = ['<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"><label class="form-check-label" for="flexCheckDefault">  Default checkbox</label>', '<input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"><label class="form-check-label" for="flexRadioDefault1">Default radio</label>'];

  let otherelems = [, '<label for="formFile" class="form-label">Default file input example</label><input class="form-control" type="file" id="formFile">', '<label for="exampleColorInput" class="form-label">Color picker</label><input type="color" class="form-control form-control-color" id="exampleColorInput" value="#563d7c" title="Choose your color">', '<label for="customRange1" class="form-label">Example range</label><input type="range" class="form-range"  min="0" max="5" step="0.5" id="customRange1">',];


  let inputgroups = ['<div class="input-group mb-3"><span class="input-group-text" id="basic-addon1">@</span><input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"></div>', '<div class="input-group mb-3"><input type="text" class="form-control" placeholder="Recipient\'s username" aria-label="Recipient\'s username" aria-describedby="basic-addon2"><span class="input-group-text" id="basic-addon2">@example.com</span></div>', '<div class="input-group mb-3">  <span class="input-group-text gr-1">$</span> <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)"><span class="input-group-text gr-2">.00</span></div>', '<div class="input-group mb-3"><input type="text" class="form-control gr-1" placeholder="Username" aria-label="Username"><span class="input-group-text">@</span><input type="text" class="form-control gr-2" placeholder="Server" aria-label="Server"></div>', '<div class="input-group"><span class="input-group-text">With textarea</span><textarea class="form-control" aria-label="With textarea"></textarea></div>', '<div class="input-group"><span class="input-group-text">First and last name</span><input type="text" aria-label="First name" class="form-control gr-1"><input type="text" aria-label="Last name" class="form-control gr-2"></div>', '<div class="input-group mb-3">  <input type="text" class="form-control" placeholder="Recipient\'s username" aria-label="Recipient\'s username" aria-describedby="button-addon2">  <button class="btn btn-outline-secondary" type="button" id="button-addon2">Button</button></div>', '<div class="input-group mb-3"><button class="btn btn-outline-secondary gr-1" type="button">Button</button><button class="btn btn-outline-secondary gr-2" type="button">Button</button><input type="text" class="form-control" placeholder="" aria-label="Example text with two button addons"></div>', '<div class="input-group">  <input type="text" class="form-control" placeholder="Recipient\'s username" aria-label="Recipient\'s username with two button addons">  <button class="btn btn-outline-secondary gr-1" type="button">Button</button>  <button class="btn btn-outline-secondary gr-2" type="button">Button</button></div>'];

  let floatingelems = ['<div class="form-floating mb-3"><input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"><label for="floatingInput">Email address</label></div>', '<div class="form-floating"> <input type="password" class="form-control" id="floatingPassword" placeholder="Password"><label for="floatingPassword">Password</label></div>', '<div class="form-floating"><textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea><label for="floatingTextarea2">Comments</label></div>'];


  return (
    <>
      <Nav />
      <div className="container">
        <div className='row mt-3'>

          <div
            className='dustbin'
            onDragEnter={(e) => {
              dragPosition.current = -1;
              if (!$(e.target).hasClass('dustact')) $(e.target).addClass('dustact')
              //$(e.target).text("Drop it.. i am hungry...");
            }}
            onDragLeave={(e) => { if ($(e.target).hasClass('dustact')) $(e.target).removeClass('dustact'); }}

          >
            <FontAwesomeIcon icon="trash" /> Throw into the trash!
          </div>

          <div className='col-md-6 col-sm-6 inputs-option maxht'>

            <div className='dragnoeffect' onDragEnter={(e) => dragPosition.current = 0}>

              <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Elements</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">HTML Code</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">About</button>
                </li>
              </ul>
              <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
                  <div class="card maxh2">
                    <div class="">
                      <div className="accordion accordion-flush" id="accordionFlushExample">
                        <div className="accordion-item inputaccord">
                          <h2 className="accordion-header" id="flush-headingOne">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="true" aria-controls="flush-collapseOne">
                              Input Elements
                            </button>
                          </h2>
                          <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body">
                              {
                                inputelems && inputelems.map(function (xe, i) {
                                  return (
                                    <div
                                      className='input-text-add dragdropper'
                                      draggable="true"
                                      onDragStart={(e) => handleAdding(e)}
                                      onDragEnd={(e) => addDragElem(e)}
                                      key={i}>
                                      {Parser(xe)}
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item headeraccord">
                          <h2 className="accordion-header" id="flush-headingTwo">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                              Header/ Label Elements
                            </button>
                          </h2>
                          <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body">
                              {
                                headeerlems && headeerlems.map(function (xe, i) {
                                  return (
                                    <div
                                      className='input-text-add dragdropper'
                                      draggable="true"
                                      onDragStart={(e) => handleAdding(e)}
                                      onDragEnd={(e) => addDragElem(e)}
                                      key={i}>
                                      {Parser(xe)}
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item checkboxradioaccord">
                          <h2 className="accordion-header" id="flush-headingFour">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                              Checkbox / Radio
                            </button>
                          </h2>
                          <div id="flush-collapseFour" className="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body">
                              {
                                checboxandradio && checboxandradio.map(function (xe, i) {
                                  return (
                                    <div
                                      className='input-text-add dragdropper'
                                      draggable="true"
                                      onDragStart={(e) => handleAdding(e)}
                                      onDragEnd={(e) => addDragElem(e)}
                                      key={i}>
                                      {Parser(xe)}
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item inputgroupsaccord">
                          <h2 className="accordion-header" id="flush-headingFour">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseSix" aria-expanded="false" aria-controls="flush-collapseSix">
                              Input Groups
                            </button>
                          </h2>
                          <div id="flush-collapseSix" className="accordion-collapse collapse" aria-labelledby="flush-headingSix" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body">
                              {
                                inputgroups && inputgroups.map(function (xe, i) {
                                  return (
                                    <div
                                      className='input-text-add dragdropper'
                                      draggable="true"
                                      onDragStart={(e) => handleAdding(e)}
                                      onDragEnd={(e) => addDragElem(e)}
                                      key={i}>
                                      {Parser(xe)}
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item inputgroupsaccord">
                          <h2 className="accordion-header" id="flush-headingFour">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseSeven" aria-expanded="false" aria-controls="flush-collapseSeven">
                              Floating Elements
                            </button>
                          </h2>
                          <div id="flush-collapseSeven" className="accordion-collapse collapse" aria-labelledby="flush-headingSeven" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body">
                              {
                                floatingelems && floatingelems.map(function (xe, i) {
                                  return (
                                    <div
                                      className='input-text-add dragdropper'
                                      draggable="true"
                                      onDragStart={(e) => handleAdding(e)}
                                      onDragEnd={(e) => addDragElem(e)}
                                      key={i}>
                                      {Parser(xe)}
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item otherinputsaccord">
                          <h2 className="accordion-header" id="flush-headingFour">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFive" aria-expanded="false" aria-controls="flush-collapseFive">
                              Other inputs
                            </button>
                          </h2>
                          <div id="flush-collapseFive" className="accordion-collapse collapse" aria-labelledby="flush-headingFive" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body">
                              {
                                otherelems && otherelems.map(function (xe, i) {
                                  return (
                                    <div
                                      className='input-text-add dragdropper'
                                      draggable="true"
                                      onDragStart={(e) => handleAdding(e)}
                                      onDragEnd={(e) => addDragElem(e)}
                                      key={i}>
                                      {Parser(xe)}
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
                  <div class="card maxh2">
                    <div class="">
                      <CodeMirror value={genHtml(elems)} extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]} />
                    </div></div>
                </div>
                <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabindex="0">
                  <div class="card maxh2">
                    <div class="card-body">
                      <p>Created by <a href='https://github.com/abhibagul'>Abhishek B.</a><br />You can find the source code for it below: <br /> <a href='https://github.com/abhibagul/React-DragDrop-HTML-form-builder'>https://github.com/abhibagul/React-DragDrop-HTML-form-builder</a></p>
                      <p>This tool uses following plugins:<br />
                        <ol>
                          <li>Codemirror</li>
                          <li>jquery</li>
                          <li>html react parser</li>
                          <li>Bootstrap</li>
                          <li>Font Awesome</li>
                        </ol>
                        and is created with React.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>




          </div>
          <div className='col-md-6 col-sm-6 output_form maxht' onDragEnter={(e) => dragPosition.current = 1}>
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
                      onDragEnd={(e) => arrangeElem(e)}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {Parser(e)}
                    </div>
                  </OverlayTrigger>
                )
              })
            }


          </div>

        </div>

      </div>
    </>
  );
}

export default App;
