async function setTagAsDone(element, id) {
  event.preventDefault();
  try {
    // estamos criando headers e body
    let headers = new Headers({ "Content-Type": "application/json" });
    let body = JSON.stringify({ "task": { "done": element.checked } });
    // estamos fazendo a chamada com o fetch, recebendo um json, e passando os headers e o body criados acima
    let response = await fetch(`/tasks/${id}?_method=put`, { 'headers': headers, "body": body, "method": "PUT" });
    let data = await response.json();
    let task = data.task;
    let parent = element.parentNode; // elemento pai do checkbox que veio com o this

    if (task.done) {
      element.checked = true;
      parent.classList.add('has-text-success');
      parent.classList.add('is-italic');
    } else {
      element.checked = false;
      parent.classList.remove('has-text-success');
      parent.classList.remove('is-italic');
    }

  } catch (error) {
    console.log(error);
    alert("erro ao atualizar a tarefa");
  }

}