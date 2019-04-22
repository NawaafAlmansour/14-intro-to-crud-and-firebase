firebase.initializeApp(config);

var messageAppReference = firebase.database();

$(() => {
  var $messageBoardDiv = $('.message-board');
  console.log(messageAppReference)

  $('#message-form').submit(event => {
    event.preventDefault()
 
    var message = $('#message').val()
    $('#message').val('')
 
    var messagesReference = messageAppReference.ref('messages');
 
    messagesReference.push({
      message: message,
      votes: 0
    })
  })  

  function getFanMessages() {    
    messageAppReference
    .ref('messages')
    .on('value', (results) => {
      $messageBoardDiv.empty()

      let allMessages = results.val()
      
      for (let msg in allMessages) {        
        // UPVOTE
        var $upVoteElement = $(`<i class="fa fa-thumbs-up pull-right"></i>`)
        $upVoteElement.on('click', (e) => {
          let id = e.target.parentNode.id
          let updatedUpvotes = parseInt(e.target.parentNode.getAttribute('data-votes')) + 1
          console.log(updatedUpvotes)

          messageAppReference
          .ref(`messages/${id}/`)
          .update({votes: updatedUpvotes})
            .then(() => { console.log("Update succeeded.") })
            .catch(error => { console.log("Update failed: " + error.message) });
        }) 

        // DOWNVOTE
        var $downVoteElement = $(`<i class="fa fa-thumbs-down pull-right"></i>`)

        $downVoteElement.on('click', (e) => {
          let id = e.target.parentNode.id
          console.log(id)
        })        
        
        // DELETE MESSAGE
        var $deleteElement = $(`<i class="fa fa-trash pull-right delete"></i>`)
        $deleteElement.on('click', (e) => {
          let id = e.target.parentNode.id
          
          messageAppReference
          .ref(`messages/${id}`)
          .remove()
            .then(function() {
              console.log("Remove succeeded.")
            })
            .catch(function(error) {
              console.log("Remove failed: " + error.message)
            });
        })

        var $votes = $(`<div class="pull-right">${allMessages[msg].votes}</div>`)

        // CREATE NEW MESSAGE LI ELEMENT
        let $newMessage = $(`<li id=${msg} data-votes=${allMessages[msg].votes}>${allMessages[msg].message}</li>`);

        // APPEND ICONS TO THE LI
        $newMessage
          .append($votes)
          .append($deleteElement)
          .append($downVoteElement)
          .append($upVoteElement)

        $messageBoardDiv.append($newMessage);
      }
    })
  }



  
  
  
  getFanMessages()
})
