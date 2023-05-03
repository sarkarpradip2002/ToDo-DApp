var indCount = 0;
const TodoAddress = "0x3985274907850EfB88f3944A1fD9E635AcaF53F0";
const TodoABI =[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "desc",
				"type": "string"
			}
		],
		"name": "addTask",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "deletetask",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "newtitle",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "newdesc",
				"type": "string"
			}
		],
		"name": "editTask",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTasks",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "desc",
						"type": "string"
					}
				],
				"internalType": "struct todo.Task[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");
provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts) => {
        signer = provider.getSigner(accounts[0]);
        TodoContract = new ethers.Contract(
            TodoAddress,
            TodoABI,
            signer
        );
    });
});

AddTask = async () => {
    let title=document.getElementById("title").value
    let desc=document.getElementById("desc").value
    const setTodo=TodoContract.addTask(title,desc)
    await setTodo
}

GetTasks= async()=>{
    let alltasks=document.getElementById("alltasks")
    let tasks= await TodoContract.getTasks()
    alltasks.innerHTML=''
    for(let i=0;i<tasks.length;i++){
        alltasks.innerHTML+=`<div id="${i}" class="tasks">
        <div>
            <label for="title${i}">Title:</label>
            <div id="title${i}" type="text">${tasks[i].title}</div>
        </div>
        <div>
            <label for="desc${i}">Description:</label>
            <div id="desc${i}" type="text">${tasks[i].desc}</div>
        </div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal${i}" data-bs-whatever="@mdo" onClick="putitems(${i})">Edit Task</button>
        <button onClick="DeleteTask(${i})">Delete task</button>

		<div class="modal fade" id="exampleModal${i}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">New message</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form>
          <div class="mb-3">
            <label for="recipient-name${i}" class="col-form-label">Title:</label>
            <input type="text" class="form-control" id="recipient-name${i}">
          </div>
          <div class="mb-3">
            <label for="message-text${i}" class="col-form-label">Description:</label>
            <textarea class="form-control" id="message-text${i}"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onClick="EditTask(${i})">Edit List</button>
      </div>
    </div>
  </div>
</div>
    </div>`
	}
    }

DeleteTask=async (ind)=>{
    const take=await TodoContract.deletetask(ind)
}

putitems=async(ind)=>{
	let taketitle=document.getElementById(`title${ind}`).innerText
	let takedesc=document.getElementById(`desc${ind}`).innerText
	let title=document.getElementById(`recipient-name${ind}`)
	title.value=taketitle
	let desc=document.getElementById(`message-text${ind}`)
	desc.value=takedesc
}

EditTask=async(ind)=>{	
	let title=document.getElementById(`recipient-name${ind}`).value
	let desc=document.getElementById(`message-text${ind}`).value
	await TodoContract.editTask(ind,title,desc)
}

