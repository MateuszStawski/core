import {
  ExternalLinksScrapingResult,
  getScrapedElementId,
  PostScrapingResult,
  UserScrapingResult,
} from 'shared/scraping';

import { isHandleNode } from './utils';

export class Scraper {
  public static getExternalLinks(): ExternalLinksScrapingResult[] {
    const externalLinkNodes = [
      ...document.querySelectorAll('a[href^="https://t.co"]'),
    ];
    return externalLinkNodes
      .map((node) => {
        const { height, top } = node.getBoundingClientRect();
        if (!height) {
          return;
        }

        const link = node.getAttribute('href');

        if (!link) {
          return;
        }

        return {
          node,
          nodeId: getScrapedElementId(node),
          top: top + window.scrollY,
          data: { link },
        };
      })
      .filter(Boolean);
  }

  public static getPosts(): PostScrapingResult[] {
    const selector = '[data-testid="tweet"]';
    const posts = [...document.querySelectorAll(selector)];

    return posts
      .map((post) => {
        const textContent = post.querySelector('a')?.textContent;
        const indexOfAnchor = textContent?.endsWith('reposted') ? 1 : 0;

        const username = post
          .querySelectorAll('a')
          [indexOfAnchor]?.getAttribute('href')
          ?.replace('/', '');

        if (!username) {
          return;
        }

        const linkNodeRect = post.getBoundingClientRect();
        if (!linkNodeRect.height) {
          return;
        }

        return {
          node: post,
          nodeId: getScrapedElementId(post),
          top: linkNodeRect.top + window.scrollY,
          data: {
            authorUsername: username,
          },
        };
      })
      .filter(Boolean);
  }

  private static findUsernameElement(element: Element) {
    const usernameElement = [
      ...element.querySelectorAll(
        '.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3',
      ),
    ].find((element) => {
      const textContent = element.textContent;
      return textContent?.startsWith('@');
    });

    if (!usernameElement?.textContent || !usernameElement.parentElement) {
      return;
    }

    return {
      element: usernameElement.parentElement,
      username: usernameElement.textContent.replace('@', ''),
    };
  }

  public static getUsers(): UserScrapingResult[] {
    const selector =
      'div.r-dnmrzs.r-1ny4l3l, .r-gtdqiz .css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci, .css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1pi2tsx.r-1777fci';
    const userBarElements = [...document.querySelectorAll(selector)];

    const scrapedUsers: UserScrapingResult[] = [];
    let isHandleUserFound = false;

    for (const userBarElement of userBarElements) {
      const usernameElement = Scraper.findUsernameElement(userBarElement);
      if (!usernameElement) {
        continue;
      }
      const { height, top } = usernameElement.element.getBoundingClientRect();

      if (!height) {
        continue;
      }

      const calculatedTop = top + window.scrollY;

      if (
        scrapedUsers.some((scrapedUser) => {
          return (
            scrapedUser.top === calculatedTop &&
            scrapedUser.data.username === usernameElement.username
          );
        })
      ) {
        continue;
      }

      // temp hack, we need to apply more explicit scraping for twitter instead of relying on random classnames
      const isNodeForUserHandle = isHandleNode(userBarElement as HTMLElement);
      if (isNodeForUserHandle && isHandleUserFound) {
        continue;
      }
      // this is a fix for Twitter styles for handle user
      if (isNodeForUserHandle) {
        isHandleUserFound = true;
        const containerThatWillHaveBadge =
          userBarElement.querySelector('div > span');
        const arrayMaybeWithBlueCheck =
          containerThatWillHaveBadge?.querySelectorAll(
            ':scope > span > span',
          ) ?? [];
        for (const element of arrayMaybeWithBlueCheck) {
          (element as HTMLElement | null)?.parentElement?.style.setProperty(
            'display',
            'flex',
            'important',
          );
        }
        (containerThatWillHaveBadge as HTMLElement | null)?.style.setProperty(
          'display',
          'flex',
          'important',
        );
        (containerThatWillHaveBadge as HTMLElement | null)?.style.setProperty(
          'align-items',
          'center',
          'important',
        );
      }

      scrapedUsers.push({
        node: userBarElement,
        nodeId: getScrapedElementId(userBarElement),
        top: top + window.scrollY,
        data: {
          username: usernameElement.username,
        },
      });
    }

    return scrapedUsers;
  }
}
