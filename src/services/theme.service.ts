 
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2 } from '@angular/core';
 
type ThemeType= 'light' | 'dark'
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
theme: ThemeType = 'light';
// private renderer2: Renderer2,
constructor( @Inject(DOCUMENT) private doc: Document) { this.initialize() }
  initialize() {
    this.removeAllTheme();
     this.theme = (localStorage.getItem('appTheme') || 'light') as ThemeType;
    this.selectTheme(this.theme);
    // this.loadTheme();
  }
  // selectedTheme = 'materia';
  insertedElement: HTMLElement;
  loadTheme() {
    import(
      /* webpackChunkName: "[request]" */
      // ../../assets/styles/
      `${this.theme}-theme.js`
    )
      .then((s) => s.default)
      .then(this.insertToDom);
  }

  insertToDom = (content: string) => {
    const element = document.createElement('style');
    element.textContent = content;
    document.head.appendChild(element);

    if (this.insertedElement) this.insertedElement.remove();
    this.insertedElement = element;
  };
  getCurrentTheme()
  {
    return (localStorage.getItem('appTheme') || 'light') as ThemeType;
  }
  selectTheme(theme: ThemeType)
  {
    console.log(theme);
    this.removeAllTheme();
    localStorage.setItem('appTheme', theme);
    this.attachTheme(theme);
  }
  attachTheme(theme: ThemeType)
  {
    // assets/css/theme/
    const themeUrl = `${theme}-theme.css`;
    // const link = this.renderer2.createElement('link') as HTMLLinkElement;
    const link = this.doc.createElement('link') as HTMLLinkElement;
    link.href = themeUrl;
    link.rel ='stylesheet';
    link.className ='app-theme';
    const head = this.doc.querySelector('head');
    // if(head)
    // {
    //   this.renderer2.appendChild(head , link);
    // }
     head?.appendChild(link);
  }
  removeAllTheme()
  {
    const themes = Array.from(this.doc.querySelectorAll('.app-theme'));
    themes.forEach(theme => {
      theme.remove();
    });
  }
}
