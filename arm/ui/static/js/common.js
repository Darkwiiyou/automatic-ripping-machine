/*jshint multistr: true */
/*jshint esversion: 6 */
/*global $:false, jQuery:false */
/* jshint node: true */
/* jshint strict: false */

const MODEL_ID = "#exampleModal";
const DB_SUCCESS_BTN_ID = "#save-get-success";
const DB_FAIL_BTN_ID = "#save-get-failed";
const MSG_1_ID = "#message1 .alert-heading";
const SEARCH_BOX_ID = "#searchquery";
const MODAL_TITLE = ".modal-title";
const CARD_DECK = ".card-deck";
const SUCCESS_CLASS = "alert-success";
const MODAL_FOOTER = ".modal-footer";

function getRipperName(job, idsplit) {
    let ripperName;
    if (job.ripper) {
        ripperName = job.ripper;
    } else {
        if (idsplit[0] === "0") {
            ripperName = "Local";
        } else {
            ripperName = "";
        }
    }
    return ripperName;
}

function addJobItem(job, authenticated) {
    // Local server or remote
    const idsplit = job.job_id.split("_");
    console.log(`${idsplit[1]} - ${idsplit[0]}`)
    //Start creating the card with job id and header title (compact layout)
    let x = `<div class="col-lg-4 col-md-6" id="jobId${job.job_id}"><div class="card compact m-3 mx-auto">`;
    x += `<div class="card-header d-flex justify-content-between align-items-center">
            <strong id="jobId${job.job_id}_header" class="text-truncate" style="max-width: 75%;">${titleManual(job)}</strong>
            <img id="jobId${job.job_id}_status" src="static/img/${job.status}.png" height="18" alt="${job.status}" title="${job.status}">
          </div>`;
    // Main holder for the 3 sections of info - includes 1 section (Poster img)
    // Position text full-width, overlay poster on right for perfect left alignment
    if (idsplit[1] === undefined) {
        x += `<div class="position-relative">`+
             `${buildMiddleSection(job)}`+
             `<div class="poster-right"><a href="/jobdetail?job_id=${job.job_id}">${posterCheck(job, true)}</a></div>`+
             `</div>`;
    } else {
        x += `<div class="position-relative">`+
             `${buildMiddleSection(job)}`+
             `<div class="poster-right"><a href="${job.server_url}/jobdetail?job_id=${idsplit[1]}">${posterCheck(job, true)}</a></div>`+
             `</div>`;
    }
    // Section 2 (Middle) closed; image is on the right consistently
    x += buildRightSection(job, idsplit, authenticated);
    // Close Job.card
    x += "</div></div></div>";
    return x;
}

function transcodingCheck(job) {
    let x = "";
    if (job.status === "transcoding" && job.stage !== "" && job.progress || job.disctype === "music" && job.stage !== "") {
        x += `<div id="jobId${job.job_id}_stage" class="job-meta"><span class="label">Stage:</span> ${job.stage}</div>`;
        x += `<div id="jobId${job.job_id}_progress" >`;
        x += `<div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                aria-valuenow="${job.progress_round}" aria-valuemin="0" aria-valuemax="100"
                style="width: ${job.progress_round}%; background-color: #6c757d;">
                </div>
              </div></div>`;
        x += `<div id="jobId${job.job_id}_eta" class="job-meta"><span class="label">ETA:</span> ${job.eta}</div>`;
    }
    // YYYY-MM-DD
    const d = new Date(Date.parse(job.start_time));
    const datestring = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

    x += `<div class="job-meta"><span class="label">Start Date:</span> ${datestring}</div>`;
    x += `<div class="job-meta"><span class="label">Start Time:</span> ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}</div>`;
    x += `<div class="job-meta"><span class="label">Job Time:</span> ${job.job_length === undefined ? "Ongoing" : job.job_length}</div>`;
    return x;
}

function musicCheck(job, idsplit) {
    let x = "";
    if (job.video_type !== "Music") {
        x = `<a href="titlesearch?job_id=${idsplit[1]}" class="btn btn-primary">Title Search</a>
             <a href="customTitle?job_id=${idsplit[1]}" class="btn btn-primary">Custom Title</a>
             <a href="changeparams?config_id=${idsplit[1]}" class="btn btn-primary">Edit Settings</a>`;
    }
    return x;
}

function posterCheck(job, small=false) {
    let x;
    let image;
    if (job.poster_url !== "None" && job.poster_url !== "N/A") {
        x = `<img id="jobId${job.job_id}_poster_url" alt="poster img" src="${job.poster_url}" ${small ? 'class="img-thumbnail poster-sm"' : 'width="240px" class="img-thumbnail"'}>`;
    } else {
        if (job.video_type === "Music") {
            image = 'music.png';
        } else {
            image = 'none.png';
        }
        x = `<img id="jobId${job.job_id}_poster_url" alt="poster img" src="/static/img/${image}" ${small ? 'class="img-thumbnail poster-sm"' : 'width="240px" class="img-thumbnail"'}>`;
    }
    return x;
}

function titleManual(job) {
    let x;
    if (job.title_manual !== "None") {
        x = `${job.title_manual}(${job.year})`;
    } else {
        x = `${job.title}(${job.year})`;
    }
    return x;
}

function buildMiddleSection(job) {
    let x;
    x = "<div class=\"card-body px-2 py-2\">";
    x += `<div id=\"jobId${job.job_id}_year\" class=\"job-meta\"><span class=\"label\">Year:</span><span>${job.year}</span></div>`;
    x += `<div id=\"jobId${job.job_id}_video_type\" class=\"job-meta\"><span class=\"label\">Type:</span><span>${job.video_type}</span></div>`;
    x += `<div id=\"jobId${job.job_id}_devpath\" class=\"job-meta\"><span class=\"label\">Device:</span><span>${job.devpath}</span></div>`;
    x += `<div id=\"jobId${job.job_id}_stage\" class=\"job-meta\"><span class=\"label\">Stage:</span><span></span></div>`;
    x += `<div id=\"jobId${job.job_id}_progress_section\" class=\"progress-indent\">${transcodingCheck(job)}</div>`;
    x += `</div>`;
    return x;
}

function buildRightSection(job, idsplit, authenticated) {
    let x;
    // idsplit[1] should only be undefined on the /database page
    if (idsplit[1] === undefined) {
        console.log("idsplit undefined... fixing");
        idsplit[0] = "0";
        idsplit[1] = job.job_id
    } else {
        console.log(`idsplit ${idsplit[0]} - ${idsplit[1]}`);
    }
    // Section 3 (Right Top) Contains Config.values
    x = "<div class=\"col-12\"><div class=\"card-body px-2 py-1\">";
    x += `<div class=\"job-meta\"><span class=\"label\">Ripper:</span><span>${getRipperName(job, idsplit)}</span></div>`;
    x += `<div class=\"job-meta\"><span class=\"label\">Rip Method:</span><span>${job.config.RIPMETHOD}</span></div>`;
    x += `<div class=\"job-meta\"><span class=\"label\">Main Feature:</span><span>${job.config.MAINFEATURE}</span></div>`;
    x += `<div class=\"job-meta\"><span class=\"label\">Min Length:</span><span>${job.config.MINLENGTH}</span></div>`;
    x += `<div class=\"job-meta\"><span class=\"label\">Max Length:</span><span>${job.config.MAXLENGTH}</span></div>`;
    x += "</div>";
    // Section 3 (Right Bottom) Contains Buttons for arm json api
    // Only show when authenticated
    x += `<div class="card-body px-2 py-1">`;
    if (authenticated === true) {
        x += `<div class="actions-grid" ${idsplit[0] !== "0" ? "style=\"display: none;\"" : ""}>
              <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#exampleModal" data-type="abandon" data-jobid="${idsplit[1]}" 
              data-href="json?job=${idsplit[1]}&mode=abandon">Abandon</button>
              <a href="logs?logfile=${job.logfile}&mode=full" class="btn btn-secondary">View log</a>`;
        x += musicCheck(job, idsplit);
        x += `<button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#exampleModal" data-type="fixperms" 
              data-jobid="${idsplit[1]}" data-href="json?mode=fixperms&job=${idsplit[1]}">Fix Perms</button>`;
        x += `</div>`;
    }
    x += `</div>`;
    return x;
}


function updateModal(modal, modalTitle = "", modalBody = "") {
    switch (actionType) {
        case "abandon":
            modalTitle = "Abandon This Job ?";
            modalBody = "This item will be set to abandoned. You cannot set it back to active! Are you sure?";
            break;
        case "delete":
            modalTitle = "Delete this job forever ?";
            modalBody = "This item will be permanently deleted and cannot be recovered. Are you sure?";
            break;
        case "fixperms":
            modalTitle = "Try to fix this jobs folder permissions ?";
            modalBody = "This will try to set the chmod values from your arm.yaml. It wont always work, you may need to do this manually";
            break;
        case "search":
            modalTitle = "Search the database";
            modalBody = `<div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="searchlabel">Search </span></div>
                       <input type="text" class="form-control" id="searchquery" aria-label="searchquery" name="searchquery" placeholder="Search...."
                       value="" aria-describedby="searchlabel"><div id="validationServer03Feedback" class="invalid-feedback">Search string too short.</div></div>`;
            break;
        default:
            modalTitle = "Do you want to leave this page ?";
            modalBody = "To view the log file you need to leave this page. Would you like to leave ?";
    }
    modal.find(".modal-title").text(modalTitle);
    modal.find(".modal-body").html(modalBody);
}


function hideModal() {
    $('#exampleModal').modal('hide');
    $('#message1').removeClass('d-none');
    $('#message2').addClass('d-none');
    $('#message3').addClass('d-none');
}

function pingReadNotify(toastId) {
    $.ajax({
        url: "/json?mode=read_notification&notify_id=" + toastId,
        type: "get",
        timeout: 2000,
        success: function (data) {
            console.log(data)
        }
    });
}

function addToast(title, body, toastId) {
    // Get the toast timeout from UISettings
    const toast_timeout = getNotifyTimeout();
    console.log("Notification timeout: " + toast_timeout);

    const toast = `<div id="toast${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="true" data-animation="true" data-delay="${parseInt(toast_timeout)}" style="z-index:1000">
        <div class="toast-header">
            <img src="static/img/success.png" class="rounded mr-2" alt="arm message" height="20px" width="20px">
                <strong class="mr-auto">${title}</strong>
                <small class="text-muted">just now</small>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
        </div>
        <div class="toast-body">
            ${body}
        </div>
    </div>`;
    $("#toastHolder").append(toast);
    const newToast = $(`#toast${toastId}`);
    newToast.toast('show');
    newToast.on('hidden.bs.toast', function () {
        // do something...
        pingReadNotify(toastId)
    })
}

// Get the toast timeout settings from UI Settings via JSON
function getNotifyTimeout() {
    // initilise notify and set a default of 6.5 seconds
    let notify = 6500;

    $.ajax({
        url: "/json?mode=notify_timeout",
        type: "get",
        timeout: 2000,
        success: function (data) {
            console.log("UI timeout: " + data.notify_timeout);
            notify = data.notify_timeout;
        }
    });

    return notify;
}
