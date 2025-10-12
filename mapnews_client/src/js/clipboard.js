function clipboard (text) {
    navigator.clipboard.writeText(text)
    .then(() => {
        let existingDiv = footer.querySelector('#clipboard');
        console.log(existingDiv)
        if (existingDiv) {
            existingDiv.classList.remove('fade-out');
            setTimeout(function() {
                existingDiv.classList.add('fade-out');
            }, 3000); 
            setTimeout(function() {
                existingDiv.remove();
            }, 3500); 
        } else {
            let newDiv = document.createElement('div');
            newDiv.classList.add("logo");
            newDiv.id = "clipboard";
            const img = document.createElement('img');
            img.src = './src/images/icons/copy.png'
            img.classList.add("logo__img");
            const p = document.createElement('p');
            p.textContent = "Скопировано";
            p.style.color = 'grey'
            p.classList.add("logo__text");
            
            newDiv.appendChild(img)
            newDiv.appendChild(p)
        
            document.getElementById('footer').appendChild(newDiv);
    
            setTimeout(function() {
                newDiv.classList.add('fade-out');
            }, 3000);
        
            setTimeout(function() {
                newDiv.remove();
            }, 3500); 
        }})
    
    .catch(err => {
      console.log('Something went wrong', err);
    });
}