import { useRef, useState } from 'react';
import './App.css';
import Parser from 'html-react-parser';
import $ from "jquery";
function App() {

  const [elems, setElems] = useState(["<h2>HTML Form</h2>"]);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const dragPosition = useRef(0);

  const arrangeElem = () => {
    $('.highlighted').removeClass('.highlighted')


    if(dragPosition.current > 0){
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
    }else if(dragPosition.current < 0){
      //remove it!
      //duplicate element
      let _elems = [...elems];

      //remove and save the dragged element content
      const draggedItemCotent = _elems.splice(dragItem.current, 1)[0];

      //reset 
      dragItem.current = null;
      dragOverItem.current = null;

      //update
      setElems(_elems);
    }
  }


  const handleAdding = (e) => {

  }

  const addDragElem = (e) => {
    if($(e.target).hasClass("highlighted"))$('.highlighted').removeClass('.highlighted')

    if(dragPosition.current > 0){
    let _elems = [...elems];
    _elems.splice(dragOverItem.current, 0, e.target.innerHTML);
    dragItem.current = null;
    dragOverItem.current = null;
    setElems(_elems);
    }
  }

  const DragOverEl = (e,i) =>{
    if(!$(e.target).hasClass("highlighted"))$(e.target).addClass('highlighted');
    dragOverItem.current = i;
  } 

  const DragLeaveEl = (e,i) =>{
    if($(e.target).hasClass("highlighted"))$(e.target).removeClass('highlighted');
  } 
  
  const handleDetails = (e) => {
    let $e = $(e.target).closest('.indragitem');
    //create the elemental form
     $($e).children().each(function(){
        // $(this).attributes.each(function(){
        //   console.log(this);
        // })
        $.each(this.attributes, function() {
          // this.attributes is not a plain object, but an array
          // of attribute nodes, which contain both the name and value
          if(this.specified) {
            console.log(this.name, this.value);
          }
        });
     })
  }

  return (
    <div className="container">
      <div className='row'>

        <div className='col-md-6 col-sm-6 inputs-option'>

          <div className='dragnoeffect' onDragEnter={(e)=> dragPosition.current = 0}>
          <div
            className='input-text-add dragdropper'
            draggable
            onDragStart={handleAdding}
            onDragEnd={addDragElem}>
            <label htmlFor='exampleEmailInput' className="form-label">Email address</label>
            <input type="email" id='exampleEmailInput' className="form-control" aria-describedby="emailHelp" placeholder='' />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>


          <div
            className='input-text-add dragdropper'
            draggable
            onDragStart={handleAdding}
            onDragEnd={addDragElem}>
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
           <input type="password" className="form-control" id="exampleInputPassword1"/>
          </div>

          
          </div>


          <div className='dustbin'  onDragEnter={(e)=> {
            dragPosition.current = -1;
             if(!$(e.target).hasClass('dustact'))$(e.target).addClass('dustact')
            }}
            onDragLeave={(e) => {  if($(e.target).hasClass('dustact')) $(e.target).removeClass('dustact')}}
            >
              throw into the trash!
          </div>

        </div>
        <div className='col-md-6 col-sm-6 output_form' onDragEnter={(e)=> dragPosition.current = 1}>
          {
            elems.map(function (e, i) {
              return (
                <div
                  className="input_elem indragitem"
                  key={i}
                  draggable
                  onClick={handleDetails}
                  onDragStart={(e) => dragItem.current = i}
                  onDragEnter={(e) => DragOverEl(e,i)}
                  onDragLeave={(e) => DragLeaveEl(e,i)}
                  onDragEnd={arrangeElem}
                  onDragOver={(e) => e.preventDefault()}>
                  {Parser(e)}
                </div>
              )
            })
          }
        </div>
      </div>

    </div>
  );
}

export default App;
