// *** By state name ***
function state(state){
  if(!state){
    return ''
  }
  state = state.toLowerCase().trim()
  var url = ""
  switch (state){
    case state:
      url = `school.state=${state}&`
      break;
//No location entered
    case '':
    case undefined:
      url = ''
      break;
//State not found
    default:
      url='errStateNotFound'
      break;
    }
  return url
}


// *** By city name ***
function city(city){
  if(!city){
    return ''
  }
  city = city.toLowerCase().trim().replace(/ /g, "%20")
  var url = ""
  switch (city){
    case city:
      url = `school.city=${city}&`
      break;
//No location entered
    case '':
    case undefined:
      url = ''
      break;
//City not found
    default:
      url='errCityNotFound'
      break;
    }
  return url
}

// *** By region ***
function regionId(region){
  if(!region){
    return ''
  }
  region = region.trim()
  var url = ""
  switch (region) {
    case region:
      url = `school.region_id=${region}&`
      break;
//No location entered
    case '':
    case undefined:
      url = ''
      break;
//Region not found
    default:
      url='errRegionNotFound'
      break;
    }
  return url
}

// *** By women only ***
function womenOnly(women){
  if(!women){
    return ''
  }
  women = women.trim()
  var url = ""
  switch (women) {
    case women:
      url = `school.women_only=${women}&`
      break;
//No location entered
    case '':
    case undefined:
      url = ''
      break;
//Women only not found
    default:
      url='errWomenOnlyNotFound'
      break;
    }
  return url
}

// *** By men only ***
function menOnly(men){
  if(!men){
    return ''
  }
  men = men.trim()
  var url = ""
  switch (men) {
    case men:
      url = `school.men_only=${men}&`
      break;
//No location entered
    case '':
    case undefined:
      url = ''
      break;
//Women only not found
    default:
      url='errMenOnlyNotFound'
      break;
    }
  return url
}

// *** By school size ***
function determineSchoolSize (school_size, school_size1){

    var sizeUrl = ''

    school_size = school_size.replace(/,/g, '')
    school_size1 = school_size1.replace(/,/g, '')

    if(school_size && school_size1){
        sizeUrl = `2015.student.size__range=${school_size1}..${school_size}&`

    }else if (school_size){

        switch(school_size){
            case 'small': 
                sizeUrl = `2015.student.size__range=..5000&`
                break;
            case 'medium': 
                sizeUrl = `2015.student.size__range=5000..15000&`
                break;
            case 'large': 
                sizeUrl = `2015.student.size__range=15000..30000&`
                break;
            case 'huge': 
                sizeUrl = `2015.student.size__range=30000..&`
                break;
            default: 
                sizeUrl = `2015.student.size__range=..${school_size}&`
        }
    }else{
        sizeUrl = ''
    }

    return sizeUrl

}

// *** By major ***
function determineMajor (major){
  if (!major){
    return ''
  }
  var url = ''
//have the percentage inside ${} just to highlight it (based on 2015-2016)
  switch(major){
    case 'agriculture':
      url = `2015.academics.program_percentage.agriculture__range=${37005/1920718}..&`
      break;
    case 'architechture':
      url = `2015.academics.program_percentage.architechture__range=${8823/1920718}..&`
      break;
    case 'culture':
      url = `2015.academics.program_percentage.ethnic_cultural_women__range=${7840/1920718}..&`
      break;
    case 'communications':
      url = `2015.academics.program_percentage.communication__range=${92554/1920718}..&`
      break;
    case 'computer':
      url = `2015.academics.program_percentage.computer__range=${64405/1920718}..&`
      break;
    case 'cooking':
      url = `2015.academics.program_percentage.personal_culinary__range=${0.01}..&`
      break;
    case 'education':
      url = `2015.academics.program_percentage.education__range=${87217/1920718}..&`
      break;
    case 'engineering':
      url = `2015.academics.program_percentage.engineering__range=${106850/1920718}..&`
      break;
    case 'language':
      url = `2015.academics.program_percentage.language__range=${18427/1920718}..&`
      break;
    case 'legal':
      url = `2015.academics.program_percentage.legal__range=${4243/1920718}..&`
      break;
    case 'english':
      url = `2015.academics.program_percentage.english__range=${42795/1920718}..&`
      break;
    case 'humanities':
      url = `2015.academics.program_percentage.humanities__range=${43661/1920718}..&`
      break;
    case 'library':
      url = `2015.academics.program_percentage.library__range=${85/1920718}..&`
      break;
    case 'biology':
      url = `2015.academics.program_percentage.biological__range=${113749/1920718}..&`
      break;
    case 'math':
      url = `2015.academics.program_percentage.mathematics__range=${22777/1920718}..&`
      break;
    case 'military':
      url = `2015.academics.program_percentage.military__range=${358/1920718}..&`
      break;
    case 'philosophy':
      url = `2015.academics.program_percentage.philosophy_religious__range=${10157/1920718}..&`
      break;
    case 'theology':
      url = `2015.academics.program_percentage.theology_religious_vocation__range=${9804/1920718}..&`
      break;
    case 'physical science':
      url = `2015.academics.program_percentage.engineering__range=${30477/1920718}..&`
      break;
    case 'psychology':
      url = `2015.academics.program_percentage.psychology__range=${117440/1920718}..&`
      break;
    case 'security':
      url = `2015.academics.program_percentage.security_law_enforcement__range=${61157/1920718}..&`
      break;
    case 'social services':
      url = `2015.academics.program_percentage.public_administration_social_service__range=${34432/1920718}..&`
      break;
    case 'social science':
      url = `2015.academics.program_percentage.social_science__range=${90000/1920718}..&`
      break;
    case 'transportation':
      url = `2015.academics.program_percentage.transportation__range=${4529/1920718}..&`
      break;
    case 'art':
      url = `2015.academics.program_percentage.visual_performing__range=${92979/1920718}..&`
      break;
    case 'health':
      url = `2015.academics.program_percentage.health__range=${228896/1920718}..&`
      break;
    case 'business':
      url = `2015.academics.program_percentage.business_marketing__range=${371694/1920718}..&`
      break;
    case 'history':
      url = `2015.academics.program_percentage.history__range=${70000/1920718}..&`
      break;
//No major entered
    case '':
    case undefined:
      url=''
      break;
//Major not found
    default:
      url = 'errMajorNotFound'
      break;
  }
  return url
}

function determineIncome (moneys) {
  //take out comma, turn it into a number  
  var income = Number(moneys.replace(/,/g, ''))

    console.log(income)
    var incomeFieldString = ''

    if (income <= 30000){
        incomeFieldString = `,2015.cost.net_price.public.by_income_level.0-30000,2015.cost.net_price.private.by_income_level.0-30000`
    }else if (income > 30000 && income <=48000){
        incomeFieldString = `,2015.cost.net_price.public.by_income_level.300001-48000,2015.cost.net_price.private.by_income_level.30001-48000`
    }else if (income > 48000 && income <=75000){
        incomeFieldString = `,2015.cost.net_price.public.by_income_level.48001-75000,2015.cost.net_price.private.by_income_level.48001-75000`
    }else if (income > 75000 && income <= 110000){
        incomeFieldString = `,2015.cost.net_price.public.by_income_level.75001-110000,2015.cost.net_price.private.by_income_level.75001-110000`
    }else if (income > 110000){
        incomeFieldString = `,2015.cost.net_price.public.by_income_level.110001-plus,2015.cost.net_price.private.by_income_level.110001-plus`
    }else{
        incomeFieldString = ''
    }

    console.log('Income string: ' + incomeFieldString )
    return incomeFieldString
}

module.exports = {
    state,
    city,
    regionId,
    womenOnly,
    menOnly,
    determineSchoolSize,
    determineMajor,
    determineIncome

}
