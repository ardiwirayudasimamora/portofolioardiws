fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyBnZ0clcSR2ggbrsMn8vOvVbLMAb7J6Wjg")
  .then(res => res.json())
  .then(data => {
    if(data.models) {
        console.log(data.models.map(m => m.name).join("\n"));
    } else {
        console.log("Error:", data);
    }
  })
  .catch(console.error);
