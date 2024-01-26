const addDarkClasses = (elements) => {
  elements.forEach((element) => {
    const classes = element.classList;
    classes.add("dark:!bg-navy-800");
    classes.add("dark:!text-white");
  });
};

export const setClassDarkCustom = (refDT) => {
  const element = refDT?.current?.getElement();
  if (element) {
    const headerDT = element.querySelector(".p-datatable-header");
    const footerDT = element.querySelector(".p-paginator");

    const bodyTheadDT = element.querySelectorAll(
      ".p-datatable-wrapper .p-datatable-table thead tr th"
    );
    const bodyDT = element.querySelectorAll(
      ".p-datatable-wrapper .p-datatable-table tbody tr td"
    );

    addDarkClasses(bodyDT);
    addDarkClasses(bodyTheadDT);

    const classheaderDT = headerDT.classList;
    const classfooterDT = footerDT.classList;

    classheaderDT.add("dark:!bg-navy-800");
    classheaderDT.add("dark:!text-white");

    classfooterDT.add("dark:!bg-navy-800");
    classfooterDT.add("dark:!text-white");
  }
};
