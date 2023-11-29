/// <reference types="animejs" />
import anime from 'animejs/lib/anime.es.js';
import Layout from '../layout/layout';
export declare class SchmancyGrid extends Layout {
    static styles: any[];
    layout: boolean;
    flow: 'row' | 'col' | 'dense' | 'row-dense' | 'col-dense';
    align: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    justify: 'start' | 'center' | 'end' | 'stretch';
    gap: 'none' | 'sm' | 'md' | 'lg';
    cols: number | 'none' | string | undefined;
    rows: number | 'none' | string | undefined;
    anime: anime.AnimeParams;
    wrap: boolean;
    assignedElements: HTMLElement[];
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-grid': SchmancyGrid;
    }
}
