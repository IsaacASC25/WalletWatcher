document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: '2025-08-07',
    headerToolbar: {
      left: 'title',
      center: '',
      right: 'prev,next today'
    }
  });

  // read events
  var json = localStorage.getItem("Events");
  var events = [];
  if (json) {
      events = JSON.parse(json);
  }
  events.forEach(function(event){
    calendar.addEvent(event);
  });

  calendar.render();

  document.getElementById('eventAdd').addEventListener('submit', function (prevent) {
    prevent.preventDefault();

    var id = document.getElementById('eventTitle').value;
    var amount = document.getElementById('eventAmount').value;
    var date = document.getElementById('eventDate').value;
    var category = getCategoryById(id);


    calendar.addEvent({
      title: `${id}: $${amount}`,
      start: date,
      extendedProps: {
        id: id,
        amount: amount,
      }
    });

    // save events
    var events = [];
    calendar.getEvents().forEach(function(event){
      events.push(event.toJSON());
    });
    var json = JSON.stringify(events);
    localStorage.setItem("Events", json);
    this.reset();
  });

  function tally(startDate, optional_end){
    var Ecategories = {};
    var Icategories = {};
    var endDate = optional_end || startDate;
    var startDateObj = new Date(startDate);
    var endDateObj = new Date(endDate);
    let expense = 0;
    let income = 0;
    let total = 0;

    calendar.getEvents().forEach(function(event){
      if(event.start >= startDateObj && event.start <= endDateObj){
        let category = getCategoryById(event.extendedProps.id);

        if(!category.isIncome){
          expense += parseFloat(event.extendedProps.amount);
          Ecategories[category.id] = (Ecategories[category.id] || 0) + parseFloat(event.extendedProps.amount);
        }
        else {
          income += parseFloat(event.extendedProps.amount);
          Icategories[category.id] = (Icategories[category.id] || 0) + parseFloat(event.extendedProps.amount);
        }
        total = income-expense
      }
    });
    return [income, expense, total, Ecategories, Icategories];
  }

  calendar.on('eventClick', function(info) {
  if (confirm(`Delete "${info.event.title}"?`)) {
    info.event.remove();

    //save2
    var updatedEvents = [];
    calendar.getEvents().forEach(function(event) {
      updatedEvents.push(event.toJSON());
    });

    localStorage.setItem("Events", JSON.stringify(updatedEvents));
  }
});

  document.getElementById('eventReport').addEventListener('submit', function (prevent) {
    prevent.preventDefault();
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    const [income, expense, total, Ecategories, Icategories] = tally(start, end);

    let container = document.getElementById('reportResults');
    if (!container) {
      const form = document.getElementById('eventReport');
      container = document.createElement('div');
      container.id = 'reportResults';
      form.insertAdjacentElement('afterend', container);
    }

    container.innerHTML = `
      <h4>Expense Categories</h4>
      <ul>
        ${Object.entries(Ecategories)
          .map(([category, value]) => `<li>${category}: $${Number(value || 0).toFixed(2)}</li>`)
          .join('')}
      </ul>

      <h4>Income Categories</h4>
      <ul>
        ${Object.entries(Icategories)
          .map(([category, value]) => `<li>${category}: $${Number(value || 0).toFixed(2)}</li>`)
          .join('')}
      </ul>

      <div class="report-item"><strong>Income:</strong> $${Number(income || 0).toFixed(2)}</div>
      <div class="report-item"><strong>Expense:</strong> $${Number(expense || 0).toFixed(2)}</div>
      <div class="report-item"><strong>Total:</strong> $${Number(total || 0).toFixed(2)}</div>
    `;
  });
});


//First, check if what you are looking for already exists 
//If it does exist, do what you want to do with it
//If it does not exist, make it for the first time, then do what you want


//Clear cache button