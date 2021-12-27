var ip = document.getElementById("ip")
var file = document.getElementById("file")
var btn = document.getElementById("btn");
var parent = document.getElementById("parent");

let selected_file = "";

file.addEventListener("change", function(event)
{
  const files = event.target.files;

  if(files.length)
  {
    selected_file = files[0];

    console.log(files)
  }
})

btn.addEventListener("click", async function()
{
  if(ip.value)
  {
    
    const result = await saveTodo(ip.value, selected_file);

    if(result.status)
    {
      var li = document.createElement("li");
      li.innerHTML = ip.value;
      parent.appendChild(li);

      ip.value = ""
    }
    else
    {
      alert("error")
    }

  }
})

function saveTodo(value, file)
{

  const formData = new FormData();

  formData.append('todo_image', file);
  formData.append('text', value);

  return fetch("http://localhost:3000/todo",{
    method:"post",
    body:formData
  }).then(function(response)
  {
    return response.json()
  })
}

function getTodo()
{
  return fetch("http://localhost:3000/todo").then(function(response)
  {
    return response.json()
  })
}

getTodo().then(function(result)
{
  if(result.status)
  {
    result.data.forEach(function(todo)
    {
      var li = document.createElement("li");
      li.innerHTML = todo.text;

      var img = document.createElement("img");
      img.src = todo.url;

      li.appendChild(img)

      parent.appendChild(li);
    })
  }
})