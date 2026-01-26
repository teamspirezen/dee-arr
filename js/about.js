/* REVEAL */
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
    }
  });
},{threshold:0.2});

reveals.forEach(el=>observer.observe(el));

/* COUNTERS */
const counters = document.querySelectorAll("[data-count]");

counters.forEach(counter=>{
  let done=false;
  const run=()=>{
    if(done) return;
    done=true;
    let target=+counter.dataset.count;
    let count=0;
    const inc=Math.ceil(target/60);
    const timer=setInterval(()=>{
      count+=inc;
      if(count>=target){
        counter.textContent=target+(counter.textContent.includes("%")?"%":"+");
        clearInterval(timer);
      }else{
        counter.textContent=count;
      }
    },20);
  };
  observer.observe(counter);
  counter.addEventListener("visible",run);
});
