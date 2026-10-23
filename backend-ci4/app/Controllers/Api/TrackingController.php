<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ClickEventModel;
use App\Models\PageViewModel;
use App\Models\VisitorModel;

class TrackingController extends BaseController
{
    /**
     * CI4.7: respond() was removed — small JSON helper.
     */
    private function respond(array $data, int $code = 200)
    {
        return $this->response->setStatusCode($code)->setJSON($data);
    }

    /**
     * POST /api/track/visit
     * Register (or update) a visitor and log the landing page view.
     */
    public function visit()
    {
        $body = $this->jsonBody();

        $visitorId = $this->sanitizeId($body['visitor_id'] ?? '');
        if ($visitorId === '') {
            return $this->respond(['ok' => false, 'error' => 'visitor_id required'], 422);
        }

        $now = date('Y-m-d H:i:s');

        $visitorModel = new VisitorModel();
        $existing      = $visitorModel->where('visitor_id', $visitorId)->first();

        if ($existing) {
            $visitorModel->update($existing['id'], [
                'last_seen_at' => $now,
                'ip_address'   => $this->request->getIPAddress(),
                'user_agent'   => $this->sanitizeText($this->request->getUserAgent()->getAgentString(), 512),
            ]);
        } else {
            $visitorModel->insert([
                'visitor_id'    => $visitorId,
                'ip_address'    => $this->request->getIPAddress(),
                'user_agent'    => $this->sanitizeText($this->request->getUserAgent()->getAgentString(), 512),
                'first_seen_at' => $now,
                'last_seen_at'  => $now,
            ]);
        }

        $this->logPageView($visitorId, $body);

        return $this->respond(['ok' => true]);
    }

    /**
     * POST /api/track/page-view
     */
    public function pageView()
    {
        $body      = $this->jsonBody();
        $visitorId = $this->sanitizeId($body['visitor_id'] ?? '');

        if ($visitorId === '') {
            return $this->respond(['ok' => false, 'error' => 'visitor_id required'], 422);
        }

        $this->logPageView($visitorId, $body);

        return $this->respond(['ok' => true]);
    }

    /**
     * POST /api/track/event
     * Generic click / event tracker. This is what powers the admin
     * "where users click" view and the payment-button click counter.
     */
    public function event()
    {
        $body = $this->jsonBody();

        $visitorId = $this->sanitizeId($body['visitor_id'] ?? '');
        $eventName = $this->sanitizeText($body['event_name'] ?? '', 64);

        if ($visitorId === '' || $eventName === '') {
            return $this->respond(['ok' => false, 'error' => 'visitor_id and event_name required'], 422);
        }

        $eventData = $body['event_data'] ?? null;
        if (is_array($eventData)) {
            $eventData = json_encode($eventData);
        } elseif (! is_string($eventData)) {
            $eventData = null;
        }
        if ($eventData !== null) {
            $eventData = mb_substr($eventData, 0, 4000);
        }

        $clickEventModel = new ClickEventModel();
        $clickEventModel->insert([
            'visitor_id'   => $visitorId,
            'session_id'   => $this->sanitizeId($body['session_id'] ?? ''),
            'event_name'   => $eventName,
            'element_id'   => $this->sanitizeText($body['element_id'] ?? '', 128),
            'element_text' => $this->sanitizeText($body['element_text'] ?? '', 255),
            'page_url'     => $this->sanitizeText($body['page_url'] ?? '', 1024),
            'tag'          => $this->sanitizeText($body['tag'] ?? '', 16),
            'href'         => $this->sanitizeText($body['href'] ?? '', 1024),
            'event_data'   => $eventData,
            'ip_address'   => $this->request->getIPAddress(),
            'created_at'   => date('Y-m-d H:i:s'),
        ]);

        return $this->respond(['ok' => true]);
    }

    /**
     * POST /api/track/heartbeat — keep session alive (last_seen update only).
     */
    public function heartbeat()
    {
        $body      = $this->jsonBody();
        $visitorId = $this->sanitizeId($body['visitor_id'] ?? '');

        if ($visitorId !== '') {
            (new VisitorModel())->where('visitor_id', $visitorId)
                ->update(null, ['last_seen_at' => date('Y-m-d H:i:s')]);
        }

        return $this->respond(['ok' => true]);
    }

    /**
     * POST /api/track/end-session
     */
    public function endSession()
    {
        return $this->respond(['ok' => true]);
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private function logPageView(string $visitorId, array $body): void
    {
        (new PageViewModel())->insert([
            'visitor_id' => $visitorId,
            'session_id' => $this->sanitizeId($body['session_id'] ?? ''),
            'page_url'   => $this->sanitizeText($body['page_url'] ?? '', 1024),
            'page_title' => $this->sanitizeText($body['page_title'] ?? '', 255),
            'referrer'   => $this->sanitizeText($body['referrer'] ?? '', 1024),
            'ip_address' => $this->request->getIPAddress(),
            'created_at' => date('Y-m-d H:i:s'),
        ]);
    }

    private function jsonBody(): array
    {
        $body = $this->request->getJSON(true);

        return is_array($body) ? $body : [];
    }

    private function sanitizeId(string $value): string
    {
        return preg_replace('/[^A-Za-z0-9_-]/', '', mb_substr($value, 0, 64)) ?? '';
    }

    private function sanitizeText(?string $value, int $max): string
    {
        return trim(mb_substr((string) $value, 0, $max));
    }
}
